import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2ff', // light sky blue background
    padding: 1,
    paddingBottom: 40,
  },

  header: {
    height: 100,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d0e6ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  logo: {
    width: 180,
    height: 60,
    resizeMode: 'contain',
  },

  content: {
    padding: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },

  cardContainer: {
    gap: 16,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 16,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6', // blue accent
  },

  placeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af', // strong blue
  },

  district: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
  },

  placeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },

  districtText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },

  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#94a3b8',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
