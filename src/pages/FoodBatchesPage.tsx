import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  Edit2, 
  Trash2, 
  HeartHandshake, 
  ShieldCheck, 
  ArrowRight,
  Upload,
  Calendar,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  FoodBatch, 
  FoodCategory, 
  FoodType, 
  StorageCondition, 
  PackagingStatus, 
  AppearanceStatus, 
  DonationStatus, 
  QualityStatus 
} from '../types';
import { useAppContext } from '../context/AppContext';

interface FoodBatchesPageProps {
  batches?: FoodBatch[];
  onAddBatch?: (batch: FoodBatch) => void;
  onUpdateBatch?: (batch: FoodBatch) => void;
  onDeleteBatch?: (id: string) => void;
  onStartQualityCheck: (batchId: string) => void;
  onCreateDonation: (batchId: string) => void;
  isAddModalOpenInitially?: boolean;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const FoodBatchesPage: React.FC<FoodBatchesPageProps> = ({
  batches,
  onAddBatch,
  onUpdateBatch,
  onDeleteBatch,
  onStartQualityCheck,
  onCreateDonation,
  isAddModalOpenInitially = false,
  showToast
}) => {
  const context = useAppContext();
  const effectiveBatches = batches || context.batches;
  const effectiveAddBatch = onAddBatch || context.handleAddBatch;
  const effectiveUpdateBatch = onUpdateBatch || context.handleUpdateBatch;
  const effectiveDeleteBatch = onDeleteBatch || context.handleDeleteBatch;

  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingBatch, setEditingBatch] = useState<FoodBatch | null>(null);
  const [viewingBatch, setViewingBatch] = useState<FoodBatch | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form Fields
  const [foodItem, setFoodItem] = useState('Vegetable Rice & Sambar');
  const [category, setCategory] = useState<FoodCategory>('Rice');
  const [foodType, setFoodType] = useState<FoodType>('Cooked Food');
  const [mealsPrepared, setMealsPrepared] = useState<number>(310);
  const [mealsServed, setMealsServed] = useState<number>(292);
  const [preparedKg, setPreparedKg] = useState<number>(77.5);
  const [servedKg, setServedKg] = useState<number>(63.5);
  const [prepDateTime, setPrepDateTime] = useState<string>(new Date().toISOString().slice(0, 16));
  
  // Default deadline 4 hours from now
  const defaultDeadline = new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16);
  const [deadlineDateTime, setDeadlineDateTime] = useState<string>(defaultDeadline);
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('Proper');
  const [packagingStatus, setPackagingStatus] = useState<PackagingStatus>('Intact');
  const [appearance, setAppearance] = useState<AppearanceStatus>('Normal');
  const [notes, setNotes] = useState<string>('Hot thermal container in central hall dining block.');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Auto-calculated fields
  const remainingMeals = Math.max(0, mealsPrepared - mealsServed);
  const surplusKg = Math.max(0, Math.round((preparedKg - servedKg) * 10) / 10);

  // Status logic based on prompt instructions
  const computeBatchStatus = (
    surplus: number, 
    deadline: string, 
    storage: StorageCondition, 
    appear: AppearanceStatus,
    pkg: PackagingStatus
  ): { donationStatus: DonationStatus; qualityStatus: QualityStatus } => {
    const isExpired = new Date() > new Date(deadline);
    if (isExpired) {
      return { donationStatus: 'Expired', qualityStatus: 'Do Not Redistribute' };
    }
    if (storage === 'Improper' || appear === 'Suspicious' || pkg === 'Damaged') {
      return { donationStatus: 'Do Not Redistribute', qualityStatus: 'Do Not Redistribute' };
    }
    if (surplus === 0) {
      return { donationStatus: 'No Surplus', qualityStatus: 'Pending Assessment' };
    }
    return { donationStatus: 'Surplus Detected', qualityStatus: 'Safe for Human Review' };
  };

  const resetForm = () => {
    setEditingBatch(null);
    setFoodItem('Vegetable Rice & Sambar');
    setCategory('Rice');
    setFoodType('Cooked Food');
    setMealsPrepared(310);
    setMealsServed(292);
    setPreparedKg(77.5);
    setServedKg(63.5);
    setPrepDateTime(new Date().toISOString().slice(0, 16));
    setDeadlineDateTime(new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16));
    setStorageCondition('Proper');
    setPackagingStatus('Intact');
    setAppearance('Normal');
    setNotes('Hot thermal container in central hall dining block.');
    setImageUrl('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (batch: FoodBatch) => {
    setEditingBatch(batch);
    setFoodItem(batch.foodItem);
    setCategory(batch.category);
    setFoodType(batch.foodType);
    setMealsPrepared(batch.mealsPrepared);
    setMealsServed(batch.mealsServed);
    setPreparedKg(batch.preparedKg);
    setServedKg(batch.servedKg);
    setPrepDateTime(batch.prepDateTime.slice(0, 16));
    setDeadlineDateTime(batch.deadlineDateTime.slice(0, 16));
    setStorageCondition(batch.storageCondition);
    setPackagingStatus(batch.packagingStatus);
    setAppearance(batch.appearance);
    setNotes(batch.notes || '');
    setImageUrl(batch.imageUrl || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItem.trim()) {
      showToast('Error', 'Food item name is required.', 'error');
      return;
    }

    const { donationStatus, qualityStatus } = computeBatchStatus(
      surplusKg,
      deadlineDateTime,
      storageCondition,
      appearance,
      packagingStatus
    );

    if (editingBatch) {
      const updated: FoodBatch = {
        ...editingBatch,
        foodItem,
        category,
        foodType,
        mealsPrepared,
        mealsServed,
        preparedKg,
        servedKg,
        remainingKg: surplusKg,
        remainingMeals,
        prepDateTime,
        deadlineDateTime,
        storageCondition,
        packagingStatus,
        appearance,
        notes,
        imageUrl: imageUrl || undefined,
        donationStatus: editingBatch.donationStatus === 'Delivered' ? 'Delivered' : donationStatus,
        qualityStatus
      };
      effectiveUpdateBatch(updated);
      showToast('Batch Updated', `Updated ${batchIdFormat(editingBatch.id)} with ${surplusKg} kg surplus.`, 'success');
    } else {
      const newId = `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${(effectiveBatches.length + 1).toString().padStart(2, '0')}`;
      const newBatch: FoodBatch = {
        id: newId,
        foodItem,
        category,
        foodType,
        mealsPrepared,
        mealsServed,
        preparedKg,
        servedKg,
        remainingKg: surplusKg,
        remainingMeals,
        prepDateTime,
        deadlineDateTime,
        storageCondition,
        packagingStatus,
        appearance,
        notes,
        imageUrl: imageUrl || undefined,
        qualityScore: surplusKg > 0 ? 100 : undefined,
        qualityStatus,
        donationStatus
      };
      effectiveAddBatch(newBatch);
      showToast('Batch Registered', `Batch ${newId} logged. Surplus identified: ${surplusKg} kg (${remainingMeals} meals).`, 'success');
    }

    setIsModalOpen(false);
    resetForm();
  };

  const batchIdFormat = (id: string) => id.length > 18 ? id.slice(-10) : id;

  // Filtered batches
  const filteredBatches = effectiveBatches.filter(b => {
    const matchSearch = b.foodItem.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || b.category === categoryFilter;
    const matchStat = statusFilter === 'ALL' || b.donationStatus === statusFilter;
    return matchSearch && matchCat && matchStat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              Real-time Surplus Tracking
            </span>
            <span className="text-xs text-slate-400">Surplus Detection Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Food Batches & Surplus Detection
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log meal batches, compute residual surplus weight automatically, track redistribution windows, and initiate NGO donation workflows.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Batch</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by food item or batch ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="ALL">All Categories</option>
            <option value="Rice">Rice</option>
            <option value="Curry">Curry</option>
            <option value="Snacks">Snacks</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Dessert">Dessert</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="Surplus Detected">Surplus Detected</option>
            <option value="Offered">Offered to NGO</option>
            <option value="Delivered">Delivered</option>
            <option value="Do Not Redistribute">Do Not Redistribute</option>
            <option value="No Surplus">No Surplus</option>
          </select>
        </div>
      </div>

      {/* Food Batches Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Batch ID & Food</th>
                <th className="px-4 py-3.5">Category & Type</th>
                <th className="px-4 py-3.5">Prepared (kg)</th>
                <th className="px-4 py-3.5">Served (kg)</th>
                <th className="px-4 py-3.5">Surplus (kg / Meals)</th>
                <th className="px-4 py-3.5">Redistribution Deadline</th>
                <th className="px-4 py-3.5">Quality Status</th>
                <th className="px-4 py-3.5">Donation Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Batch ID & Food */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{b.foodItem}</div>
                      <div className="text-[11px] font-mono text-slate-400">{b.id}</div>
                    </td>

                    {/* Category & Type */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-700">{b.category}</div>
                      <div className="text-[11px] text-slate-500">{b.foodType}</div>
                    </td>

                    {/* Prepared */}
                    <td className="px-4 py-3.5 font-medium text-slate-600">
                      {b.preparedKg} kg <span className="text-[10px] text-slate-400">({b.mealsPrepared} m)</span>
                    </td>

                    {/* Served */}
                    <td className="px-4 py-3.5 font-medium text-slate-600">
                      {b.servedKg} kg <span className="text-[10px] text-slate-400">({b.mealsServed} m)</span>
                    </td>

                    {/* Surplus */}
                    <td className="px-4 py-3.5">
                      {b.remainingKg > 0 ? (
                        <div>
                          <span className="font-extrabold text-amber-700 text-sm">
                            {b.remainingKg} kg
                          </span>
                          <span className="text-[11px] text-amber-800 font-semibold block">
                            {b.remainingMeals} meals surplus
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">0 kg (Fully consumed)</span>
                      )}
                    </td>

                    {/* Deadline */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 font-medium text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(b.deadlineDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(b.deadlineDateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </td>

                    {/* Quality Status */}
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.qualityStatus === 'Safe for Human Review'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.qualityStatus === 'Needs Manual Inspection'
                          ? 'bg-amber-100 text-amber-800'
                          : b.qualityStatus === 'Do Not Redistribute'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.qualityStatus}
                      </span>
                    </td>

                    {/* Donation Status */}
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.donationStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.donationStatus === 'Surplus Detected'
                          ? 'bg-amber-100 text-amber-800'
                          : b.donationStatus === 'Offered'
                          ? 'bg-teal-100 text-teal-800'
                          : b.donationStatus === 'Do Not Redistribute' || b.donationStatus === 'Expired'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.donationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingBatch(b)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Batch"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {b.remainingKg > 0 && b.donationStatus !== 'Do Not Redistribute' && (
                          <button
                            onClick={() => onStartQualityCheck(b.id)}
                            className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                            title="Start Quality Check"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}

                        {b.remainingKg > 0 && b.donationStatus !== 'Delivered' && b.donationStatus !== 'Do Not Redistribute' && (
                          <button
                            onClick={() => onCreateDonation(b.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Create Donation Request"
                          >
                            <HeartHandshake className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => effectiveDeleteBatch(b.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Batch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    No food batches found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingBatch ? 'Edit Food Batch' : 'Record New Prepared Food Batch'}
                </h3>
                <p className="text-xs text-slate-500">
                  Surplus quantity is automatically calculated based on prepared and served weights.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Food Item Name
                  </label>
                  <input
                    type="text"
                    value={foodItem}
                    onChange={(e) => setFoodItem(e.target.value)}
                    placeholder="e.g. Vegetable Rice & Sambar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Rice">Rice</option>
                    <option value="Curry">Curry / Dal</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Food Type
                  </label>
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value as FoodType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Cooked Food">Cooked Food</option>
                    <option value="Raw Material">Raw Material</option>
                    <option value="Packaged Food">Packaged Food</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preparation Time
                  </label>
                  <input
                    type="datetime-local"
                    value={prepDateTime}
                    onChange={(e) => setPrepDateTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Meals Prepared
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={mealsPrepared}
                    onChange={(e) => setMealsPrepared(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Meals Served
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={mealsServed}
                    onChange={(e) => setMealsServed(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prepared Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    value={preparedKg}
                    onChange={(e) => setPreparedKg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Served Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    value={servedKg}
                    onChange={(e) => setServedKg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Automatic Surplus Calculations Banner */}
              <div className="p-3.5 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 grid grid-cols-2 gap-4 text-center">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Remaining Meals</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">{remainingMeals} meals</div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">Surplus Weight</span>
                  <div className="text-xl font-extrabold text-emerald-700 mt-0.5">{surplusKg} kg</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Redistribution Deadline (Use-By)
                  </label>
                  <input
                    type="datetime-local"
                    value={deadlineDateTime}
                    onChange={(e) => setDeadlineDateTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Storage Condition
                  </label>
                  <select
                    value={storageCondition}
                    onChange={(e) => setStorageCondition(e.target.value as StorageCondition)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Proper">Proper (Thermal insulated / Refrigerated)</option>
                    <option value="Improper">Improper (Ambient exposure / Uncovered)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Packaging Status
                  </label>
                  <select
                    value={packagingStatus}
                    onChange={(e) => setPackagingStatus(e.target.value as PackagingStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Intact">Intact (Clean seal / Closed container)</option>
                    <option value="Damaged">Damaged (Broken lid / Leakage)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Appearance & Aroma
                  </label>
                  <select
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value as AppearanceStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Normal">Normal (Fresh texture, natural appearance)</option>
                    <option value="Suspicious">Suspicious (Staff-reported odor concern, abnormal texture, or discoloration)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kitchen Notes & Location
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ground floor pantry, vessel #4"
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-colors cursor-pointer"
                >
                  {editingBatch ? 'Save Changes' : 'Confirm & Log Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Batch Details Modal */}
      {viewingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setViewingBatch(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4 mb-4">
              <span className="text-xs font-mono font-bold text-slate-400">{viewingBatch.id}</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{viewingBatch.foodItem}</h3>
              <p className="text-xs text-slate-500">{viewingBatch.category} • {viewingBatch.foodType}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Surplus Available</span>
                <span className="text-base font-extrabold text-amber-700">{viewingBatch.remainingKg} kg</span>
                <span className="text-[10px] text-slate-500 block">({viewingBatch.remainingMeals} meals)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Prepared vs Served</span>
                <span className="text-base font-bold text-slate-800">{viewingBatch.preparedKg} kg / {viewingBatch.servedKg} kg</span>
                <span className="text-[10px] text-slate-500 block">({viewingBatch.mealsPrepared} / {viewingBatch.mealsServed} meals)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Storage Condition</span>
                <span className="font-semibold text-slate-800">{viewingBatch.storageCondition}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Packaging Status</span>
                <span className="font-semibold text-slate-800">{viewingBatch.packagingStatus}</span>
              </div>
            </div>

            {viewingBatch.notes && (
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-slate-700 mb-4">
                <strong>Kitchen Notes:</strong> {viewingBatch.notes}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs font-semibold">
              <button
                onClick={() => {
                  setViewingBatch(null);
                  onStartQualityCheck(viewingBatch.id);
                }}
                className="px-3 py-2 bg-teal-50 text-teal-800 hover:bg-teal-100 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Quality Assessment</span>
              </button>
              <button
                onClick={() => {
                  setViewingBatch(null);
                  onCreateDonation(viewingBatch.id);
                }}
                className="px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>NGO Match</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
