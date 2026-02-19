import React, { useState, useEffect } from "react";
// Using lucide-react icons
import { Upload, FileText, Video, Package, BookOpen, Clock, Download, Eye, Trash2, Search, CheckCircle2 } from "lucide-react";

import { Pencil } from "lucide-react";


// Import Firebase services and methods
import { 
    storage, 
    db, 
    collection, 
    setDoc, 
    deleteDoc, 
    doc, 
    query, 
    onSnapshot, 
    orderBy,
    ref as storageRef, 
    uploadBytesResumable, 
    getDownloadURL, 
    deleteObject 
} from "../../firebase"; 

// --- Sub-Components ---

const FileUploadCard = ({
  title,
  description,
  icon: Icon,
  color,
  onUpload,
  isUploading
}) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");






  const handleUpload = () => {
    if (!image || !file || !category || !desc) {
      alert("Fill all fields");
      return;
    }

    const type = title.includes("Video")
      ? "Video"
      : title.includes("Workshop")
      ? "Workshop"
      : title.includes("Magazine")
      ? "Magazine"
      : "PDF";

    onUpload(image, file, type, category, desc);

    setImage(null);
    setFile(null);
    setCategory("");
    setDesc("");
  };


  


  return (
    <div className="group relative rounded-[28px] p-[1px] bg-gradient-to-br from-white/40 to-white/10 hover:scale-[1.02] transition-all duration-300">

      <div className="bg-white/90 backdrop-blur-xl rounded-[28px] p-6 shadow-xl border border-white/30 h-full flex flex-col">

        {/* ICON */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${color} shadow-lg mb-4`}>
          <Icon size={26} />
        </div>

        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{description}</p>

        {/* CATEGORY */}
        <div className="relative mb-4">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="peer w-full border rounded-xl px-3 pt-4 pb-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="absolute left-3 top-2 text-xs text-gray-500 peer-focus:text-blue-600 transition-all">
            Category
          </label>
        </div>

        {/* DESCRIPTION */}
        <div className="relative mb-4">
          <textarea
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="peer w-full border rounded-xl px-3 pt-4 pb-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="absolute left-3 top-2 text-xs text-gray-500 peer-focus:text-blue-600 transition-all">
            Short Description
          </label>
        </div>

        {/* IMAGE UPLOAD */}
        <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition mb-3">
          <p className="text-xs text-gray-500 mb-1">Cover Image</p>
         <p className="text-sm font-medium text-gray-700 break-all text-center">
  {image ? image.name : "Click to upload"}
</p>

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {/* FILE UPLOAD */}
        <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-purple-400 transition">
          <p className="text-xs text-gray-500 mb-1">Main File</p>
          <p className="text-sm font-medium text-gray-700 break-all text-center">
            {file ? file.name : "Click to upload"}
          </p>
          <input
            type="file"
            accept={title.includes("Video") ? "video/*" : ".pdf"}
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* BUTTON */}
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`mt-6 w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${color} shadow-lg hover:shadow-2xl transition-all duration-300`}
        >
          {isUploading ? "Uploading..." : "Upload Now"}
        </button>
      </div>
    </div>
  );
};



const ContentItem = ({ item, type, onDelete, onEdit }) => {

    


    const getTypeColor = () => {
        switch(type) {
            case "PDF": return "bg-blue-100 text-blue-600";
            case "Video": return "bg-red-100 text-red-600";
            case "Workshop": return "bg-green-100 text-green-600";
            case "Magazine": return "bg-purple-100 text-purple-600";

            default: return "bg-gray-100 text-gray-600";
        }
    };

    const getPlanBadge = (plan) => {
        switch(plan) {
           case "Basic": return "bg-blue-100 text-blue-700 border-blue-200";
case "Premium": return "bg-purple-100 text-purple-700 border-purple-200";

            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };
    
    const formatDate = (isoString) => {
        try {
            return new Date(isoString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch { return "Unknown Date"; }
    }

    return (
        <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-grow min-w-0">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor()}`}>
                        {type === "PDF" && <FileText className="w-4 h-4" />}
                        {type === "Video" && <Video className="w-4 h-4" />}
                        {type === "Workshop" && <Package className="w-4 h-4" />}
                        {type === "Magazine" && <BookOpen className="w-4 h-4" />}

                    </div>
                    <div className="min-w-0">
                       <div className="mb-1">
  <p className="font-medium text-gray-800 break-words whitespace-normal">
    {item.name}
  </p>

  <div className="flex flex-wrap items-center gap-2 mt-1">
    <p className="text-xs text-gray-500">{item.category}</p>

    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getPlanBadge(item.plan)}`}>
      {item.plan || "Free"}
    </span>
  </div>

  <p className="text-xs text-gray-400 mt-1">
    {item.description}
  </p>
</div>

                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                            <span>{item.type}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{item.size}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(item.date)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                    </a>
                    <button
  onClick={() => onEdit(item)}
  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
>
  <Pencil className="w-4 h-4 text-blue-600" />
</button>

                    <a href={item.url} download={item.name} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                    </a>
                    <button onClick={() => onDelete(item.id, item.storagePath)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

export default function ContentManager() {
    const [contents, setContents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

      const [editingItem, setEditingItem] = useState(null);
const [editForm, setEditForm] = useState({
  name: "",
  category: "",
  description: "",
  plan: "Free"
});
    
    // NEW: State to track selected plan before uploading
    const [selectedPlan, setSelectedPlan] = useState("Free");



      const handleUpdate = async () => {
  try {
    await setDoc(
      doc(db, "contents", editingItem.id),
      {
        name: editForm.name,
        category: editForm.category,
        description: editForm.description,
        plan: editForm.plan
      },
      { merge: true }
    );

    setEditingItem(null);
  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
};


  const planOptions = [
    { id: "Free", color: "bg-slate-500" },
    { id: "Basic", color: "bg-blue-600" },
    { id: "Premium", color: "bg-purple-600" }
];


    useEffect(() => {
        const q = query(collection(db, "contents"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedContents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setContents(fetchedContents);
        }, (error) => {
            console.error("Error fetching contents: ", error);
        });
        return () => unsubscribe(); 
    }, []);

   const handleUploadWithImage = async (image, file, type, category, description) => {

  if (isUploading) return;

  setIsUploading(true);
  setUploadProgress(0);

  try {

    const docRef = doc(collection(db, "contents"));

    /* IMAGE UPLOAD */
    const imageRef = storageRef(
      storage,
      `content_uploads/${type}/images/${Date.now()}_${image.name}`
    );

    await uploadBytesResumable(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    /* FILE UPLOAD */
    const fileRef = storageRef(
      storage,
      `content_uploads/${type}/files/${Date.now()}_${file.name}`
    );

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      console.error,
      async () => {

        const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);

        await setDoc(docRef, {
  documentId: docRef.id,
  name: file.name,
  type,
  plan: selectedPlan,
  category,
  description,
  size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
  date: new Date().toISOString(),
  imageUrl,
  url: fileUrl,
  pdfUrl: type === "Magazine" ? fileUrl : null,
  storagePath: fileRef.fullPath
});


        setIsUploading(false);
        setUploadProgress(0);
      }
    );

  } catch (err) {
    console.error(err);
    setIsUploading(false);
  }
};


    const deleteItem = async (id, storagePath) => {
        if (!window.confirm("Are you sure you want to delete this content?")) return;
        try {
            const fileRef = storageRef(storage, storagePath);
            await deleteObject(fileRef);
            await deleteDoc(doc(db, "contents", id));
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                await deleteDoc(doc(db, "contents", id)); 
            } else {
                alert(`Deletion failed: ${error.message}`);
            }
        }
    };

 const filteredContents = contents.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.plan?.toLowerCase().includes(searchTerm.toLowerCase())
);


    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    📚 Content Manager
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">Upload and manage your educational content</p>
            </div>

            {/* PLAN SELECTION SECTION */}
            <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Step 1: Select Target Plan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {planOptions.map((plan) => (
                        <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                                selectedPlan === plan.id 
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" 
                                : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${plan.color}`}></div>
                                <span className={`font-bold ${selectedPlan === plan.id ? "text-blue-700" : "text-gray-600"}`}>
                                    {plan.id}
                                </span>
                            </div>
                            {selectedPlan === plan.id && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                        </button>
                    ))}
                </div>
            </div>

      <div className="mb-10">

  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
    Step 2: Upload Files for {selectedPlan}
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">

    <FileUploadCard
      title="PDF Library"
      description="Notes & study materials"
      icon={FileText}
      color="from-blue-500 to-cyan-500"
      isUploading={isUploading}
      onUpload={handleUploadWithImage}
    />

    <FileUploadCard
      title="Video Classes"
      description="Lectures & recorded sessions"
      icon={Video}
      color="from-red-500 to-pink-500"
      isUploading={isUploading}
      onUpload={handleUploadWithImage}
    />

    <FileUploadCard
      title="Digital Magazine"
      description="Upload full monthly magazine"
      icon={BookOpen}
      color="from-purple-600 to-indigo-600"
      isUploading={isUploading}
      onUpload={handleUploadWithImage}
    />

    <FileUploadCard
      title="Workshops"
      description="Projects & templates"
      icon={Package}
      color="from-green-500 to-emerald-500"
      isUploading={isUploading}
      onUpload={handleUploadWithImage}
    />

  </div>
</div>

            
            {isUploading && (
                <div className="mb-8 bg-blue-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                        className="bg-blue-600 h-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-xs text-blue-600 text-center mt-2 font-bold">
                        Uploading to {selectedPlan}: {uploadProgress.toFixed(0)}%
                    </p>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Content Library</h2>
                        <p className="text-gray-600 text-sm">Total files: {contents.length}</p>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, type, or plan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {filteredContents.length > 0 ? (
                        filteredContents.map((item) => (
                            <ContentItem
  key={item.id}
  item={item}
  type={item.type}
  onDelete={deleteItem}
  onEdit={(item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      description: item.description,
      plan: item.plan || "Free"
    });
  }}
/>

                            
                            
                        ))
                    ) : (
                        <div className="text-center p-8 text-gray-400">
                            <p>No results found for your search.</p>
                        </div>
                    )}
                </div>
            </div>

{editingItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-5 animate-[fadeIn_.25s_ease]">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          ✏️ Edit Content
        </h2>

        <button
          onClick={() => setEditingItem(null)}
          className="text-gray-400 hover:text-red-500 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      {/* TITLE */}
      <div>
        <label className="text-xs font-semibold text-gray-500">Title</label>
        <input
          className="w-full mt-1 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 outline-none"
          value={editForm.name}
          onChange={(e) =>
            setEditForm({ ...editForm, name: e.target.value })
          }
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="text-xs font-semibold text-gray-500">Category</label>
        <input
          className="w-full mt-1 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 outline-none"
          value={editForm.category}
          onChange={(e) =>
            setEditForm({ ...editForm, category: e.target.value })
          }
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-xs font-semibold text-gray-500">Description</label>
        <textarea
          rows={3}
          className="w-full mt-1 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 outline-none resize-none"
          value={editForm.description}
          onChange={(e) =>
            setEditForm({ ...editForm, description: e.target.value })
          }
        />
      </div>

      {/* PLAN SELECT */}
      <div>
        <label className="text-xs font-semibold text-gray-500">Access Plan</label>

        <div className="grid grid-cols-3 gap-3 mt-2">
          {["Free", "Basic", "Premium"].map((plan) => (
            <button
              key={plan}
              onClick={() => setEditForm({ ...editForm, plan })}
              className={`rounded-xl border py-2 text-sm font-semibold transition
                ${
                  editForm.plan === plan
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600"
                }`}
            >
              {plan}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-2">

        <button
          onClick={() => setEditingItem(null)}
          className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.03] active:scale-95 transition"
        >
          Update
        </button>

      </div>

    </div>
  </div>
)}


        </div>
    );
}