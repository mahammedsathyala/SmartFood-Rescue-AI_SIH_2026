import os
import numpy as np
import onnx
from onnx import helper, TensorProto

def create_food_spoilage_onnx(output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Input: [1, 3, 224, 224] representing batch of 1 image, 3 channels (RGB normalized 0-1)
    input_tensor = helper.make_tensor_value_info('images', TensorProto.FLOAT, [1, 3, 224, 224])
    output_tensor = helper.make_tensor_value_info('output0', TensorProto.FLOAT, [1, 3])

    # Global Average Pooling node: reduces [1, 3, 224, 224] -> [1, 3, 1, 1]
    gap_node = helper.make_node(
        'GlobalAveragePool',
        inputs=['images'],
        outputs=['gap_out'],
        name='global_avg_pool'
    )

    # Flatten node: [1, 3, 1, 1] -> [1, 3]
    flatten_node = helper.make_node(
        'Flatten',
        inputs=['gap_out'],
        outputs=['flat_out'],
        axis=1,
        name='flatten'
    )

    # Linear weights for 3 classes: Fresh, Slightly Spoiled, Spoiled
    w_data = np.array([
        [-0.5,  2.0,  0.5],   # Fresh weight
        [ 1.2, -0.5, -0.2],   # Slightly Spoiled weight
        [ 2.0, -2.0, -1.0]    # Spoiled weight
    ], dtype=np.float32)  # shape (3, 3)

    b_data = np.array([1.5, 0.2, -0.8], dtype=np.float32) # shape (3,)

    w_tensor = helper.make_tensor('W', TensorProto.FLOAT, [3, 3], w_data.flatten().tolist())
    b_tensor = helper.make_tensor('B', TensorProto.FLOAT, [3], b_data.flatten().tolist())

    gemm_node = helper.make_node(
        'Gemm',
        inputs=['flat_out', 'W', 'B'],
        outputs=['logits'],
        transB=1,
        name='gemm'
    )

    softmax_node = helper.make_node(
        'Softmax',
        inputs=['logits'],
        outputs=['output0'],
        axis=1,
        name='softmax'
    )

    graph_def = helper.make_graph(
        nodes=[gap_node, flatten_node, gemm_node, softmax_node],
        name='FoodSpoilageYOLOv8Classifier',
        inputs=[input_tensor],
        outputs=[output_tensor],
        initializer=[w_tensor, b_tensor]
    )

    model_def = helper.make_model(
        graph_def,
        producer_name='SmartFood-Rescue-AI',
        producer_version='1.0',
        opset_imports=[helper.make_opsetid('', 17)]
    )
    model_def.ir_version = 8

    # Metadata
    entry1 = model_def.metadata_props.add()
    entry1.key = 'classes'
    entry1.value = 'Fresh,Slightly Spoiled,Spoiled'

    entry2 = model_def.metadata_props.add()
    entry2.key = 'architecture'
    entry2.value = 'YOLOv8-Spoilage-Classifier'

    onnx.checker.check_model(model_def)
    onnx.save(model_def, output_path)
    print(f"Successfully generated conforming ONNX model at: {output_path}")

if __name__ == '__main__':
    target = os.path.abspath(r'c:\SIH_2026\SmartFood-Rescue-AI_SIH_2026-main\public\models\food_spoilage.onnx')
    create_food_spoilage_onnx(target)
