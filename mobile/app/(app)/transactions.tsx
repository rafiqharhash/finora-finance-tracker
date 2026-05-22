import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useUIStore } from '../../src/store/useUIStore';
import { useTheme } from '../../src/theme/useTheme';
import { Colors, Spacing, Radii, FontSize, FontWeight } from '../../src/theme/tokens';
import { TransactionItem } from '../../src/components/ui/TransactionItem';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { DEMO_TRANSACTIONS } from '../../src/data/demoData';
import type { Transaction } from '../../src/api/transactions';

const CATEGORIES = ['food', 'transport', 'shopping', 'health', 'entertainment', 'bills', 'income', 'other'];
const FILTERS = ['All', 'Income', 'Expense'];

interface TxnForm {
  description: string;
  amount: string;
  category: string;
  type: 'income' | 'expense';
  notes: string;
}

export default function TransactionsScreen() {
  const { isDemoMode } = useAuthStore();
  const { currency } = useUIStore();
  const theme = useTheme();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS as Transaction[]);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TxnForm>({
    defaultValues: { description: '', amount: '', category: 'food', type: 'expense', notes: '' },
  });
  const txnType = watch('type');

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Income' && t.type === 'income') ||
        (activeFilter === 'Expense' && t.type === 'expense');
      return matchSearch && matchFilter;
    });
  }, [transactions, search, activeFilter]);

  const openAdd = () => {
    setEditTxn(null);
    reset({ description: '', amount: '', category: 'food', type: 'expense', notes: '' });
    setModalVisible(true);
  };

  const openEdit = (txn: Transaction) => {
    setEditTxn(txn);
    reset({
      description: txn.description,
      amount: String(txn.amount),
      category: txn.category,
      type: txn.type,
      notes: txn.notes ?? '',
    });
    setModalVisible(true);
  };

  const onSubmit = (data: TxnForm) => {
    const parsed: Transaction = {
      _id: editTxn?._id ?? String(Date.now()),
      type: data.type,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description,
      date: new Date().toISOString().split('T')[0],
      notes: data.notes,
    };

    if (editTxn) {
      setTransactions((prev) => prev.map((t) => (t._id === editTxn._id ? parsed : t)));
    } else {
      setTransactions((prev) => [parsed, ...prev]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setTransactions((p) => p.filter((t) => t._id !== id)) },
    ]);
  };

  const renderItem = useCallback(({ item }: { item: Transaction }) => (
    <TransactionItem
      transaction={item}
      currency={currency}
      onPress={() => openEdit(item)}
    />
  ), [currency]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Transactions</Text>
        <TouchableOpacity onPress={openAdd} style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search transactions..."
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[
              styles.filterChip,
              { backgroundColor: activeFilter === f ? Colors.primary : theme.surface, borderColor: activeFilter === f ? Colors.primary : theme.border },
            ]}
          >
            <Text style={[styles.filterText, { color: activeFilter === f ? '#fff' : theme.textSecondary }]}>{f}</Text>
          </TouchableOpacity>
        ))}
        <Text style={[styles.count, { color: theme.textMuted }]}>{filtered.length} items</Text>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💳</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No transactions found</Text>
          </View>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalCard}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {editTxn ? 'Edit Transaction' : 'Add Transaction'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Type Toggle */}
                <View style={[styles.typeToggle, { backgroundColor: theme.background }]}>
                  {(['expense', 'income'] as const).map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setValue('type', t)}
                      style={[styles.typeBtn, txnType === t && { backgroundColor: t === 'income' ? Colors.success : Colors.danger }]}
                    >
                      <Text style={[styles.typeBtnText, { color: txnType === t ? '#fff' : theme.textSecondary }]}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Controller
                  control={control}
                  name="description"
                  rules={{ required: 'Description required' }}
                  render={({ field: { onChange, value } }) => (
                    <Input label="Description" icon="text-outline" placeholder="e.g. Coffee" value={value} onChangeText={onChange} error={errors.description?.message} />
                  )}
                />
                <Controller
                  control={control}
                  name="amount"
                  rules={{ required: 'Amount required', pattern: { value: /^\d+(\.\d{0,2})?$/, message: 'Valid number required' } }}
                  render={({ field: { onChange, value } }) => (
                    <Input label="Amount" icon="cash-outline" placeholder="0.00" keyboardType="decimal-pad" value={value} onChangeText={onChange} error={errors.amount?.message} />
                  )}
                />

                {/* Category picker */}
                <Text style={[styles.catLabel, { color: theme.textSecondary }]}>Category</Text>
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.catGrid}>
                      {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => onChange(cat)}
                          style={[styles.catChip, { borderColor: value === cat ? Colors.primary : theme.border, backgroundColor: value === cat ? Colors.primarySurface : theme.background }]}
                        >
                          <Text style={[styles.catChipText, { color: value === cat ? Colors.primary : theme.textSecondary }]}>
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />

                <Button label={editTxn ? 'Update' : 'Add Transaction'} onPress={handleSubmit(onSubmit)} style={styles.submitBtn} />
                {editTxn && (
                  <Button label="Delete" variant="danger" onPress={() => { handleDelete(editTxn._id); setModalVisible(false); }} style={styles.deleteBtn} />
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, paddingTop: Spacing.base, paddingBottom: Spacing.sm },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, letterSpacing: -0.5 },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.base, borderRadius: Radii.md, borderWidth: 1, paddingHorizontal: Spacing.md, marginBottom: Spacing.md, height: 46 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: FontSize.base },
  filters: { flexDirection: 'row', paddingHorizontal: Spacing.base, gap: 8, marginBottom: Spacing.md, alignItems: 'center' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radii.full, borderWidth: 1 },
  filterText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  count: { marginLeft: 'auto', fontSize: FontSize.sm },
  list: { paddingHorizontal: Spacing.base, paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: FontSize.base },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { maxHeight: '90%' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: Spacing['2xl'], maxHeight: '100%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  typeToggle: { flexDirection: 'row', borderRadius: Radii.md, padding: 4, marginBottom: Spacing.base },
  typeBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: Radii.sm },
  typeBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  catLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, marginBottom: 8 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.base },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radii.full, borderWidth: 1 },
  catChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, textTransform: 'capitalize' },
  submitBtn: { marginTop: 8 },
  deleteBtn: { marginTop: 8 },
});
