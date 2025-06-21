import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 100,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cardContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#e6e6e6',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  district: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
   placeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  districtText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
