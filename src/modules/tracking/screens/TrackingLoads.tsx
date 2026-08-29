import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import AppHeader from '@components/custumcomponents/AppHeader';
import {colors} from '@utils/colors';

import useTrackingLoads from '../hooks/useTrackingLoads';
import TrackingLoadCard from '../components/TrackingLoadCard';

const TrackingLoads = () => {
  const navigation = useNavigation<any>();

  const {
    loads,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useTrackingLoads();


  console.log(loads)
  const handleLoadPress = (load: any) => {
  console.log('PRESSED LOAD:', load);
  console.log('PRESSED LOAD ID:', load?.LoadId);
    if (!load?.LoadId) {
    console.log('❌ LoadId is missing');
    return;
  }
    console.log(load,'pressss')
    navigation.navigate('Tracking', {
      loadId: load.LoadId
    });
  };

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <AppHeader title="Tracking Loads" />

        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading tracking loads...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <AppHeader title="Tracking Loads" />

        <View style={styles.center}>
          <Text style={styles.errorText}>
            Unable to load tracking data.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={refetch}>
            <Text style={styles.retryText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="Tracking Loads" />

      <View style={styles.container}>

        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.title}>
              Active Loads
            </Text>

            <Text style={styles.subtitle}>
              Monitor your driver's current trips
            </Text>
          </View>

          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              {loads.length}
            </Text>
          </View>
        </View>

        {isFetching && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.refreshLoader}
          />
        )}

        <FlatList
          data={loads}
          keyExtractor={item => item.LoadId}
          renderItem={({item}) => (
            <TrackingLoadCard
              item={item}
              onPress={handleLoadPress}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            loads.length === 0
              ? styles.emptyContainer
              : styles.listContainer
          }
          refreshing={isFetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                No tracking loads
              </Text>

              <Text style={styles.emptyText}>
                There are currently no active loads to track.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default TrackingLoads;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#7B8494',
  },

  countContainer: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
  },

  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },

  refreshLoader: {
    marginBottom: 8,
  },

  listContainer: {
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#7B8494',
  },

  errorText: {
    fontSize: 14,
    color: '#DC2626',
  },

  retryButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 7,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  empty: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },

  emptyText: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 13,
    color: '#8A919D',
  },
});