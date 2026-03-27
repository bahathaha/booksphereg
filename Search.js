import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Search({ onBack }) {
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Writer");

  const filters = ["Novel", "Writer", "Drama"];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="chevron-back" size={26} color="#333" />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Icon name="search-outline" size={18} color="#777" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            style={styles.input}
          />
        </View>
      </View>

      {/* FILTER ROW */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterIcon}>
          <Icon name="options-outline" size={18} color="#426A80" />
        </TouchableOpacity>

        {filters.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.chip,
              activeFilter === item && styles.chipActive,
            ]}
            onPress={() => setActiveFilter(item)}
          >
            <Text
              style={[
                styles.chipText,
                activeFilter === item && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* RESULT SECTION */}
      <View style={styles.resultSection}>
        <Text style={styles.sectionTitle}>{activeFilter}</Text>
        <Text style={styles.emptyText}>
          No {activeFilter} Available for this name
        </Text>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },

  filterIcon: {
    padding: 6,
  },

  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#EAEAEA",
  },

  chipActive: {
    backgroundColor: "#426A80",
  },

  chipText: {
    fontSize: 13,
    color: "#333",
  },

  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  resultSection: {
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8A5A1F",
    marginBottom: 8,
  },

  emptyText: {
    color: "#999",
    fontSize: 13,
  },
});