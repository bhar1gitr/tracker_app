import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    ActivityIndicator, RefreshControl, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/api';

export default function WorkerShifts() {
    const { userId, name } = useLocalSearchParams();
    const router = useRouter();

    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchUserHistory();
    }, [userId]);

    const fetchUserHistory = async () => {
        try {
            // Reuses your existing history API logic
            const data = await authService.getHistory(userId as string);
            setShifts(data);
        } catch (e) {
            console.error("History Fetch Error:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchUserHistory();
    };

    const renderShiftCard = ({ item }: any) => {
        const isOngoing = item.logoutTime === 'Ongoing';

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push({
                    pathname: '/(admin)/details', // Change this from 'worker-shifts' to 'details'
                    params: { shiftId: item._id },
                })}
                
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <View style={[styles.statusBadge, isOngoing ? styles.ongoingBg : styles.completedBg]}>
                        <Text style={[styles.statusText, isOngoing ? styles.ongoingColor : styles.completedColor]}>
                            {isOngoing ? 'ONGOING' : 'COMPLETED'}
                        </Text>
                    </View>
                </View>

                <View style={styles.timeContainer}>
                    <View style={styles.timeItem}>
                        <Ionicons name="enter-outline" size={14} color="#8E8E93" />
                        <Text style={styles.timeLabel}> Login: {item.loginTime}</Text>
                    </View>
                    <View style={styles.timeItem}>
                        <Ionicons name="exit-outline" size={14} color="#8E8E93" />
                        <Text style={styles.timeLabel}> Logout: {item.logoutTime}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.statText}>
                        <Ionicons name="location-outline" size={12} /> {item.path?.length || 0} Points
                    </Text>
                    <Text style={styles.statText}>
                        <Ionicons name="document-text-outline" size={12} /> {item.dayNotes?.length || 0} Notes
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#007AFF" />
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={shifts}
                keyExtractor={(item) => item._id}
                renderItem={renderShiftCard}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={50} color="#D1D1D6" />
                        <Text style={styles.emptyText}>No shifts found for this user.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 16 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    dateText: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    ongoingBg: { backgroundColor: '#E8F5E9' },
    completedBg: { backgroundColor: '#F2F2F7' },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    ongoingColor: { color: '#34C759' },
    completedColor: { color: '#8E8E93' },
    timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    timeItem: { flexDirection: 'row', alignItems: 'center' },
    timeLabel: { fontSize: 13, color: '#48484A' },
    footer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
        paddingTop: 12,
        alignItems: 'center'
    },
    statText: { fontSize: 12, color: '#8E8E93', marginRight: 15 },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 10, color: '#8E8E93', fontSize: 16 }
});