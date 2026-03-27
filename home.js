import React, { useState, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ScrollView,

} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Search from "./Search";
import MyCollection from "./MyCollection";
import Profile from "./Profile";

export default function ExploreScreen({
  onOpenLogin,
  onOpenReader,
  userData,
  folders,
  setFolders,
  onOpenWriter
}){
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  const insets = useSafeAreaInsets();
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("explore");
  const [showCustomize, setShowCustomize] = useState(false);

  // ✅ FIX: MISSING STATES (this broke your UI)
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [country, setCountry] = useState("");
  const [genre, setGenre] = useState("");
  const [readingLevel, setReadingLevel] = useState("Beginner");

  const handleSave = () => {
    setShowCustomize(false);
  };

  useEffect(() => {
    fetch("http://10.0.2.2:3000/api/books?page=1&limit=4")
      .then((res) => res.json())
      .then((data) => setBooks(data.books))
      .catch((err) => console.log(err));
  }, []);
 
const saveBookToFolder = async (folderId) => {
  try {
    // ✅ 1. CLOSE MODAL INSTANTLY
    setShowFolderModal(false);

    // ✅ 2. UPDATE UI INSTANTLY (NO WAIT)
    setFolders(prev =>
      prev.map(folder =>
        folder._id === folderId
          ? {
              ...folder,
              books: [
  ...(folder.books || []),
  {
    title: selectedBook.title || "Unknown",
    authors: selectedBook.authors || "Unknown",
    thumbnail: selectedBook.thumbnail,
    categories: selectedBook.categories || "General",
    description: selectedBook.description || "No description",
  },
],
            }
          : folder
      )
    );

    // ✅ 3. OPTIONAL FEEDBACK
    alert("Book saved!");

   
    const token = await AsyncStorage.getItem("token");

    fetch("http://10.0.2.2:3000/api/folders/add-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        folderId,
        book: {
          title: selectedBook.title,
          authors: selectedBook.authors,
          thumbnail: selectedBook.thumbnail,
          categories: selectedBook.categories,
          description: selectedBook.description,
        },
      }),
    });

  } catch (err) {
    console.log(err);
  }
};
 const renderBook = ({ item }) => (
  <TouchableOpacity
    style={styles.bookCard}
    onPress={() => setSelectedBook(item)}
  >
    <Image
      source={{
        uri:
          item.thumbnail && item.thumbnail.includes("id=")
            ? `https://books.google.com/books/content?id=${
                item.thumbnail.split("id=")[1]?.split("&")[0]
              }&printsec=frontcover&img=1&zoom=1`
            : "https://via.placeholder.com/120x160.png",
      }}
      style={styles.bookImage}
    />

    <Text style={styles.bookTitle} numberOfLines={1}>
      {item.title}
    </Text>

    <Text style={styles.bookAuthor} numberOfLines={1}>
      {item.authors}
    </Text>

    <Text style={styles.bookRating}>
      ⭐ {item.average_rating || "N/A"}
    </Text>
  </TouchableOpacity>
);

  const renderContent = () => {
    if (selectedBook) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>

   {/* TOP CURVE (SVG) */}
<View style={{ backgroundColor: "#F5F5F5" }}>
  <Svg width={width} height={260}>
    <Path
      d={`M0 0 H${width} V180 Q${width / 2} 260 0 180 Z`}
      fill="#426A80"
    />
  </Svg>

  {/* BACK BUTTON */}
  <TouchableOpacity
    style={{ position: "absolute", top: 50, left: 16 }}
    onPress={() => setSelectedBook(null)}
  >
    <Icon name="chevron-back" size={24} color="#fff" />
  </TouchableOpacity>
</View>
      {/* BOOK IMAGE */}
     <View style={{
  position: "absolute",
  top: 130,
  width: "100%",
  alignItems: "center",
}}>
  <Image
    source={{
      uri:
        selectedBook.thumbnail &&
        selectedBook.thumbnail.includes("id=")
          ? `https://books.google.com/books/content?id=${
              selectedBook.thumbnail.split("id=")[1]?.split("&")[0]
            }&printsec=frontcover&img=1&zoom=1`
          : "https://via.placeholder.com/120x160.png",
    }}
    style={styles.detailImage}
  />
</View>
      {/* TITLE + AUTHOR */}
      <View style={{ alignItems: "center", marginTop: 110 }}>
        <Text style={styles.titleText}>
          {selectedBook.title}
        </Text>

        <Text style={styles.authorText}>
          {selectedBook.authors}
        </Text>

        <Text style={styles.categoryText}>
          {selectedBook.categories}
        </Text>
      </View>

      {/* INFO */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Year</Text>
          <Text style={styles.infoValue}>
            {selectedBook.published_year || "2016"}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Language</Text>
          <Text style={styles.infoValue}>English</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Pages</Text>
          <Text style={styles.infoValue}>
            {selectedBook.num_pages || "168"}
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
       <TouchableOpacity
  style={styles.saveBtn}
  onPress={() => setShowFolderModal(true)}
>
          <Text style={{ color: "#fff" }}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reviewBtn}>
          <Text style={{ color: "#8A5A1F" }}>Review</Text>
        </TouchableOpacity>
      </View>
      {/* REVIEWS */}
      <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
        <Text style={styles.reviewTitle}>Reviews:</Text>

        <View style={styles.reviewItem}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Emma stone</Text>
            <Text style={styles.reviewText}>Great Book.</Text>
          </View>

          <Text style={styles.date}>3/28/2025</Text>
        </View>

      </View>

    </ScrollView>
  );
}
    if (showSearch) {
      return (
        <Search
          value={searchText}
          onChange={setSearchText}
          onClose={() => setShowSearch(false)}
          onBack={() => setShowSearch(false)}
        />
      );
    }

    if (showCustomize) {
      return (
        <ScrollView style={styles.customizeContainer}>
          <Text style={styles.customizeTitle}>Customize your Feed</Text>

          <TextInput style={styles.inputBox} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.inputBox} placeholder="Date of Birth" value={dob} onChangeText={setDob} />
          <TextInput style={styles.inputBox} placeholder="Gender" value={gender} onChangeText={setGender} />
          <TextInput style={styles.inputBox} placeholder="Occupation" value={occupation} onChangeText={setOccupation} />
          <TextInput style={styles.inputBox} placeholder="Country" value={country} onChangeText={setCountry} />
          <TextInput style={styles.inputBox} placeholder="Favorite Genre" value={genre} onChangeText={setGenre} />

          <Text style={styles.readingTitle}>Reading Level</Text>

          <View style={styles.levelRow}>
            {["Beginner", "Intermediate", "Expert"].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelBtn,
                  readingLevel === level && styles.levelActive,
                ]}
                onPress={() => setReadingLevel(level)}
              >
                <Text style={readingLevel === level ? styles.levelTextActive : { color: "#333" }}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={handleSave}>
            <Text style={styles.nextText}>Next: Find Friends</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowCustomize(false)}>
            <Text style={styles.skip}>Do this Later</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

if (activeTab === "collection") {
  return (
    <MyCollection 
      onOpenReader={onOpenReader} 
      onFolderOpen={setIsFolderOpen}
      folders={folders}
      setFolders={setFolders}
      onOpenWriter={onOpenWriter} 
    />
  );
}

    if (activeTab === "profile") {
      return <Profile onOpenLogin={onOpenLogin} userData={userData} />;
    }

    return (
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
        }}
      >
        <View style={{ marginTop: 16 }}>
          <Text style={styles.cardTitle}>Top Pick for You</Text>

          <FlatList
            data={books}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item, index) =>
              item._id?.toString() || index.toString()
            }
            renderItem={renderBook}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          />
        </View>

        <View style={{ marginTop: -10 }}>
          <Text style={styles.cardTitle}>
            People with similar interests also like
          </Text>

          <FlatList
            data={books}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item, index) =>
              item._id?.toString() || index.toString()
            }
            renderItem={renderBook}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {!selectedBook && activeTab !== "profile"&&  !isFolderOpen && (
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {!showSearch && !showCustomize && activeTab !== "profile" && (
          <Text style={styles.title}>
            {activeTab === "explore" && "Explore"}
            {activeTab === "collection" && "My Collection"}
          </Text>
        )}

        {!showSearch && !showCustomize && activeTab === "explore" && (
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSearch(true)}>
              <Icon name="search-outline" size={22} color="#555" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowCustomize(true)}>
              <Icon name="grid-outline" size={22} color="#555" />
            </TouchableOpacity>
          </View>
        )}
      </View>
          )}
      {!showCustomize && activeTab !== "profile" && <View style={styles.divider} />}

     <View style={{ flex: 1 }}>{renderContent()}</View>

{/* ✅ ADD HERE (GLOBAL MODAL) */}
{showFolderModal && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>

      <Text style={styles.modalTitle}>Select Folder</Text>

      {folders.map((folder) => (
        <TouchableOpacity
          key={folder._id}
          style={{ paddingVertical: 10 }}
          onPress={() => saveBookToFolder(folder._id)}
        >
          <Text style={{ fontSize: 16 }}>{folder.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={() => setShowFolderModal(false)}>
        <Text style={{ marginTop: 10 }}>Cancel</Text>
      </TouchableOpacity>

    </View>
  </View>
)}

      {!selectedBook&&!showCustomize && !showSearch  &&  !isFolderOpen  &&(
        <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("collection")}>
            <Icon name="library-outline" size={22} color={activeTab === "collection" ? "#8A5A1F" : "#777"} />
            <Text style={[styles.tabText, activeTab === "collection" && styles.active]}>
              My Collection
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("explore")}>
            <Icon name="add-circle" size={26} color={activeTab === "explore" ? "#8A5A1F" : "#777"} />
            <Text style={[styles.tabText, activeTab === "explore" && styles.active]}>
              Explore
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("profile")}>
            <Icon name="person-outline" size={22} color={activeTab === "profile" ? "#8A5A1F" : "#777"} />
            <Text style={[styles.tabText, activeTab === "profile" && styles.active]}>
              My Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* STYLES SAME AS YOURS */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f5" ,   paddingTop:14},

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
 
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#8A5A1F",
  },

  headerIcons: { flexDirection: "row", gap: 16 },

  iconBtn: { padding: 6 },

  divider: {
    height: 1,
    backgroundColor: "#C9C2B8",
    marginHorizontal: 16,
  },

  content: { flex: 1, paddingHorizontal: 16 },

  cardTitle: { fontSize: 16, fontWeight: "600", color: "#426A80" },

  cardSub: { color: "#777", marginTop: 4 },

  bottomNav: {
    minHeight: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 8,
  },

  tab: { alignItems: "center" },

  tabText: { fontSize: 12, color: "#777", marginTop: 2 },

  active: { color: "#8A5A1F", fontWeight: "600" },

  customizeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  customizeTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#8A5A1F",
    marginBottom: 20,
  },

  inputBox: {
    borderWidth: 1,
    borderColor: "#C48A5A",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },

  readingTitle: {
    marginTop: 10,
    fontWeight: "600",
    marginBottom: 8,
  },

  levelRow: { flexDirection: "row", gap: 10, marginBottom: 20 },

  levelBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  levelActive: {
    backgroundColor: "#426A80",
    borderColor: "#426A80",
  },

  levelTextActive: { color: "#fff" },

  nextBtn: {
    backgroundColor: "#426A80",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },

  nextText: { color: "#fff", fontWeight: "600" },

  skip: {
    textAlign: "center",
    marginTop: 14,
    color: "#777",
  },
  bookImage: {
  width: 165,
  height: 205,
 
  marginTop:10,
},

bookTitle: {
  fontSize: 14,
  fontWeight: "600",
  marginTop: 6,
  width: 164,
},

bookAuthor: {
  fontSize: 13,
  color: "#777",
  width: 164,
},

bookRating: {
  fontSize: 12,
  color: "#444",
  marginTop: 2,
},
bookCard: {
  width: 165,
  marginBottom: 16,
},


backBtn: {
  marginTop: 40,
  marginLeft: 16,
},

detailImage: {
  width: 170,
  height: 220,
  borderRadius: 10,
  backgroundColor: "#fff",
  alignSelf: "center",   // ✅ THIS FIXES CENTER
},

titleText: {
  fontSize: 20,
  fontWeight: "700",
  marginTop: 10,
},

authorText: {
  fontSize: 16,
  color: "#426A80",
  marginTop: 5,
},

categoryText: {
  color: "#777",
  marginTop: 4,
},

infoRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 20,
},

infoItem: {
  alignItems: "center",
},

infoLabel: {
  color: "#777",
},

infoValue: {
  color: "#8A5A1F",
  fontWeight: "600",
  marginTop: 5,
},

buttonRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 20,
},

saveBtn: {
  backgroundColor: "#426A80",
  paddingVertical: 12,
  paddingHorizontal: 40,
  borderRadius: 25,
},

reviewBtn: {
  borderWidth: 1,
  borderColor: "#8A5A1F",
  paddingVertical: 12,
  paddingHorizontal: 40,
  borderRadius: 25,
},

reviewTitle: {
  fontSize: 18,
  fontWeight: "600",
},

reviewItem: {
  flexDirection: "row",
  marginTop: 10,
  alignItems: "center",
},

avatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 10,
},

name: {
  fontWeight: "600",
},

reviewText: {
  color: "#555",
},

date: {
  fontSize: 12,
  color: "#777",
},
modalOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},

modalBox: {
  width: "80%",
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 20,
},

modalTitle: {
  fontSize: 18,
  fontWeight: "600",
},
});