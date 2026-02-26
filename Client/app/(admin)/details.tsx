// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
// import MapView, { Polyline, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
// import { Ionicons } from '@expo/vector-icons';
// import React, { useMemo, useState, useRef, useEffect } from 'react';
// import { BASE_URL } from '../../services/api';

// // Define Interface for better TS support
// interface Note {
//   latitude: number;
//   longitude: number;
//   text: string;
//   createdAt?: string;
//   timestamp?: string;
// }

// export default function DayDetails() {
//   const { shiftId } = useLocalSearchParams();
//   const router = useRouter();
//   const mapRef = useRef<MapView>(null);

//   const [isTaskListVisible, setTaskListVisible] = useState(false);
//   const [selectedNote, setSelectedNote] = useState<Note | null>(null);

//   // New State for API data
//   const [shiftData, setShiftData] = useState<{ date: string; path: any[]; notes: Note[] }>({
//     date: '',
//     path: [],
//     notes: []
//   });

//   // --- API FETCH ---
//   // details.tsx
//   useEffect(() => {
//     if (shiftId) {
//       // If BASE_URL is '.../api', this becomes '.../api/shift-details/ID'
//       const url = `${BASE_URL}/shift-details/${shiftId}`;
//       console.log("🚀 Final URL being called:", url);

//       fetch(url)
//         .then(async (res) => {
//           if (!res.ok) {
//             // This will help us see if it's a 404 or 500
//             const text = await res.text();
//             throw new Error(`Status: ${res.status}, Body: ${text}`);
//           }
//           return res.json();
//         })
//         .then((data) => {
//           setShiftData({
//             date: data.date || '',
//             path: data.path || [],
//             notes: data.notes || []
//           });
//         })
//         .catch((err) => console.error("❌ Fetch Error:", err));
//     }
//   }, [shiftId]);


//   // ✅ FORMAT ROUTE COORDINATES SAFELY
//   const formattedRoute = useMemo(() => {
//     return shiftData.path
//       .filter((p: any) => p?.latitude && p?.longitude)
//       .map((p: any) => ({
//         latitude: Number(p.latitude),
//         longitude: Number(p.longitude),
//       }))
//       .filter(
//         (p: any) =>
//           !isNaN(p.latitude) &&
//           !isNaN(p.longitude) &&
//           p.latitude >= -90 && p.latitude <= 90 &&
//           p.longitude >= -180 && p.longitude <= 180
//       );
//   }, [shiftData.path]);

//   // ✅ FORMAT NOTES SAFELY
//   const formattedNotes: Note[] = useMemo(() => {
//     return shiftData.notes
//       .filter((n: any) => n?.latitude && n?.longitude)
//       .map((n: any) => ({
//         ...n,
//         latitude: Number(n.latitude),
//         longitude: Number(n.longitude),
//       }))
//       .filter(
//         (n: any) =>
//           !isNaN(n.latitude) &&
//           !isNaN(n.longitude)
//       );
//   }, [shiftData.notes]);

//   const handleNotePress = (note: Note) => {
//     setSelectedNote(note);
//     setTaskListVisible(true);

//     mapRef.current?.animateToRegion(
//       {
//         latitude: note.latitude,
//         longitude: note.longitude,
//         latitudeDelta: 0.002,
//         longitudeDelta: 0.002,
//       },
//       1000
//     );
//   };

//   // ✅ SAFE INITIAL REGION
//   const initialRegion: Region = useMemo(() => {
//     if (formattedRoute.length > 0) {
//       return {
//         latitude: formattedRoute[0].latitude,
//         longitude: formattedRoute[0].longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       };
//     }
//     return {
//       latitude: 19.1970,
//       longitude: 72.9768,
//       latitudeDelta: 0.05,
//       longitudeDelta: 0.05,
//     };
//   }, [formattedRoute]);

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//         <Ionicons name="arrow-back" size={24} color="black" />
//         <Text style={styles.headerTitle}>{shiftData.date} Activity</Text>
//       </TouchableOpacity>

//       <MapView
//         ref={mapRef}
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={initialRegion}
//         key={formattedRoute.length} // Forces map refresh when path arrives
//       >
//         {formattedRoute.length > 1 && (
//           <>
//             <Polyline
//               coordinates={formattedRoute}
//               strokeColor="#007AFF"
//               strokeWidth={4}
//             />
//             <Marker
//               coordinate={formattedRoute[0]}
//               title="Start"
//               pinColor="green"
//             />
//             <Marker
//               coordinate={formattedRoute[formattedRoute.length - 1]}
//               title="End"
//               pinColor="red"
//             />
//           </>
//         )}

//         {formattedNotes.map((note, index) => (
//           <Marker
//             key={`note-marker-${index}`}
//             coordinate={{
//               latitude: note.latitude,
//               longitude: note.longitude,
//             }}
//             onPress={() => handleNotePress(note)}
//             zIndex={2000}
//             anchor={{ x: 0.5, y: 0.5 }}
//           >
//             <View style={styles.markerWrapper}>
//               <View style={styles.noteIconBubble}>
//                 <Ionicons name="list" size={16} color="white" />
//               </View>
//             </View>
//           </Marker>
//         ))}
//       </MapView>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isTaskListVisible}
//         onRequestClose={() => setTaskListVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Task Details</Text>
//               <TouchableOpacity onPress={() => setTaskListVisible(false)}>
//                 <Ionicons name="close-circle" size={32} color="#ccc" />
//               </TouchableOpacity>
//             </View>

//             {selectedNote && (
//               <View style={styles.taskItem}>
//                 <View style={styles.taskIconCircle}>
//                   <Ionicons name="location" size={24} color="#EAB308" />
//                 </View>
//                 <View style={styles.taskDetails}>
//                   <Text style={styles.taskTime}>
//                     Recorded at{" "}
//                     {new Date(
//                       selectedNote.createdAt || selectedNote.timestamp || Date.now()
//                     ).toLocaleTimeString()}
//                   </Text>
//                   <View style={styles.divider} />
//                   <Text style={styles.taskText}>{selectedNote.text}</Text>
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>

//       <View style={styles.summaryBox}>
//         <Text style={styles.summaryTitle}>Route Summary</Text>
//         <View style={styles.statRow}>
//           <View style={styles.statBox}>
//             <Text style={styles.statLabel}>Points</Text>
//             <Text style={styles.statValue}>{formattedRoute.length}</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={styles.statLabel}>Total Notes</Text>
//             <Text style={styles.statValue}>{formattedNotes.length}</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1 },
//   backBtn: {
//     position: 'absolute', top: 50, left: 20, zIndex: 10,
//     flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
//     padding: 12, borderRadius: 25, elevation: 5
//   },
//   headerTitle: { marginLeft: 10, fontWeight: 'bold' },
//   markerWrapper: { flexDirection: 'row', alignItems: 'center' },
//   noteIconBubble: {
//     backgroundColor: '#EAB308',
//     padding: 7,
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: 'white',
//     elevation: 8,
//   },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
//   modalContent: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 24, paddingBottom: 40 },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   modalTitle: { fontSize: 20, fontWeight: 'bold' },
//   taskItem: { flexDirection: 'row', alignItems: 'flex-start' },
//   taskIconCircle: { marginRight: 15, marginTop: 5 },
//   taskDetails: { flex: 1 },
//   taskTime: { fontSize: 12, color: '#8e8e93' },
//   divider: { height: 1, backgroundColor: '#eee', marginBottom: 15 },
//   taskText: { fontSize: 16, color: '#2c3e50', lineHeight: 22, fontWeight: '500' },
//   summaryBox: { padding: 25, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20 },
//   summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
//   statRow: { flexDirection: 'row' },
//   statBox: { marginRight: 40 },
//   statLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase' },
//   statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' }
// });



import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Linking } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { BASE_URL } from '../../services/api';

// 1. Updated Interface to include count fields
interface Note {
  latitude: number;
  longitude: number;
  className: string;
  directorName?: string;
  directorNumber?: string;
  address?: string;
  contactPersonName?: string;
  contactPersonNumber?: string;
  studentCount?: number; // Added
  classCount?: number;   // Added
  createdAt?: string;
  timestamp?: string;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function DayDetails() {
  const { shiftId } = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [isTaskListVisible, setTaskListVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [shiftData, setShiftData] = useState<{ date: string; path: any[]; notes: Note[] }>({
    date: '',
    path: [],
    notes: []
  });

  useEffect(() => {
    if (shiftId) {
      const url = `${BASE_URL}/shift-details/${shiftId}`;
      fetch(url)
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Status: ${res.status}, Body: ${text}`);
          }
          return res.json();
        })
        .then((data) => {
          setShiftData({
            date: data.date || '',
            path: data.path || [],
            notes: data.notes || []
          });
        })
        .catch((err) => console.error("❌ Fetch Error:", err));
    }
  }, [shiftId]);

  const formattedRoute = useMemo(() => {
    return shiftData.path
      .filter((p: any) => p?.latitude && p?.longitude)
      .map((p: any) => ({
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
      }))
      .filter(p => !isNaN(p.latitude) && !isNaN(p.longitude));
  }, [shiftData.path]);

  const totalKm = useMemo(() => {
    if (formattedRoute.length < 2) return 0;
    let distance = 0;
    for (let i = 0; i < formattedRoute.length - 1; i++) {
      distance += calculateDistance(formattedRoute[i].latitude, formattedRoute[i].longitude, formattedRoute[i + 1].latitude, formattedRoute[i + 1].longitude);
    }
    return distance;
  }, [formattedRoute]);

  // Aggregate Totals for the Day
  const totals = useMemo(() => {
    return shiftData.notes.reduce((acc, curr) => ({
      students: acc.students + (Number(curr.studentCount) || 0),
      classes: acc.classes + (Number(curr.classCount) || 0)
    }), { students: 0, classes: 0 });
  }, [shiftData.notes]);

  const formattedNotes: Note[] = useMemo(() => {
    return shiftData.notes
      .filter((n: any) => n?.latitude && n?.longitude)
      .map((n: any) => ({
        ...n,
        latitude: Number(n.latitude),
        longitude: Number(n.longitude),
      }))
      .filter((n: any) => !isNaN(n.latitude) && !isNaN(n.longitude));
  }, [shiftData.notes]);

  const handleNotePress = (note: Note) => {
    setSelectedNote(note);
    setTaskListVisible(true);
    mapRef.current?.animateToRegion({
      latitude: note.latitude,
      longitude: note.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    }, 1000);
  };

  const initialRegion: Region = useMemo(() => {
    if (formattedRoute.length > 0) {
      return {
        latitude: formattedRoute[0].latitude,
        longitude: formattedRoute[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    return { latitude: 19.1970, longitude: 72.9768, latitudeDelta: 0.05, longitudeDelta: 0.05 };
  }, [formattedRoute]);

  const callNumber = (num?: string) => { if (num) Linking.openURL(`tel:${num}`); };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerTitle}>{shiftData.date} Activity</Text>
      </TouchableOpacity>

      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={initialRegion}>
        {formattedRoute.length > 1 && (
          <>
            <Polyline coordinates={formattedRoute} strokeColor="#007AFF" strokeWidth={4} />
            <Marker coordinate={formattedRoute[0]} title="Start" pinColor="green" />
            <Marker coordinate={formattedRoute[formattedRoute.length - 1]} title="End" pinColor="red" />
          </>
        )}

        {formattedNotes.map((note, index) => (
          <Marker key={`note-${index}`} coordinate={{ latitude: note.latitude, longitude: note.longitude }} onPress={() => handleNotePress(note)}>
            <View style={styles.noteIconBubble}>
              <Ionicons name="business" size={16} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>

      <Modal animationType="slide" transparent={true} visible={isTaskListVisible} onRequestClose={() => setTaskListVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTypeLabel}>FIELD VISIT DETAILS</Text>
              <TouchableOpacity onPress={() => setTaskListVisible(false)}>
                <Ionicons name="close-circle" size={32} color="#ccc" />
              </TouchableOpacity>
            </View>

            {selectedNote && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.classNameText}>{selectedNote.className}</Text>
                
                {/* 2. New Counts Row in Modal */}
                <View style={styles.countsRow}>
                  <View style={styles.countBadge}>
                    <Ionicons name="people" size={16} color="#007AFF" />
                    <Text style={styles.countBadgeText}>{selectedNote.studentCount || 0} Students</Text>
                  </View>
                  <View style={[styles.countBadge, { backgroundColor: '#F0FDF4' }]}>
                    <Ionicons name="school" size={16} color="#16A34A" />
                    <Text style={[styles.countBadgeText, { color: '#16A34A' }]}>{selectedNote.classCount || 0} Classes</Text>
                  </View>
                </View>

                <Text style={styles.taskTime}>
                  Visited at {new Date(selectedNote.createdAt || selectedNote.timestamp || Date.now()).toLocaleTimeString()}
                </Text>

                <View style={styles.divider} />

                <View style={styles.infoSection}>
                  <View style={styles.iconCircle}><Ionicons name="person" size={18} color="#007AFF" /></View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Director / Proprietor</Text>
                    <Text style={styles.infoMainText}>{selectedNote.directorName || 'Not Provided'}</Text>
                    {selectedNote.directorNumber && (
                      <TouchableOpacity onPress={() => callNumber(selectedNote.directorNumber)}>
                        <Text style={styles.phoneLink}>{selectedNote.directorNumber}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <View style={styles.iconCircle}><Ionicons name="location" size={18} color="#EAB308" /></View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Location / Address</Text>
                    <Text style={styles.infoMainText}>{selectedNote.address || 'Not Provided'}</Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <View style={styles.iconCircle}><Ionicons name="call" size={18} color="#4ADE80" /></View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Contact Person</Text>
                    <Text style={styles.infoMainText}>{selectedNote.contactPersonName || 'Not Provided'}</Text>
                    {selectedNote.contactPersonNumber && (
                      <TouchableOpacity onPress={() => callNumber(selectedNote.contactPersonNumber)}>
                        <Text style={styles.phoneLink}>{selectedNote.contactPersonNumber}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* 3. Updated Footer Summary with Students & Classes */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Route Summary</Text>
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{totalKm.toFixed(2)} km</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Students</Text>
            <Text style={[styles.statValue, { color: '#007AFF' }]}>{totals.students}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Classes</Text>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>{totals.classes}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  backBtn: {
    position: 'absolute', top: 50, left: 20, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    padding: 12, borderRadius: 25, elevation: 5
  },
  headerTitle: { marginLeft: 10, fontWeight: 'bold' },
  noteIconBubble: {
    backgroundColor: '#EAB308', padding: 8, borderRadius: 20,
    borderWidth: 2, borderColor: 'white', elevation: 5,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '75%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTypeLabel: { fontSize: 12, color: '#888', fontWeight: 'bold', letterSpacing: 1 },
  classNameText: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
  taskTime: { fontSize: 13, color: '#8e8e93', marginTop: 4 },
  countsRow: { flexDirection: 'row', marginTop: 10, gap: 10 },
  countBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 5 },
  countBadgeText: { fontSize: 14, fontWeight: '600', color: '#007AFF' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 20 },
  infoSection: { flexDirection: 'row', marginBottom: 22, alignItems: 'flex-start' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase', marginBottom: 2 },
  infoMainText: { fontSize: 16, color: '#333', fontWeight: '600' },
  phoneLink: { fontSize: 15, color: '#007AFF', fontWeight: 'bold', marginTop: 2 },
  summaryBox: { 
    padding: 25, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 10
  },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { flex: 1, alignItems: 'center' }, 
  statLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' }
});