import React, { useState, useEffect } from "react";
// Using lucide-react icons
import { Upload, FileText, Video, Package, Clock, Download, Eye, Trash2, Search, CheckCircle2 } from "lucide-react";

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

const FileUploadCard = ({ title, description, icon: Icon, color, onFileSelect, isUploading }) => {
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            onFileSelect(e.target.files[0]);
            e.target.value = null; 
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>
            </div>
            <label className={`cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept={
                        title.includes("PDF") ? ".pdf" : 
                        title.includes("Video") ? "video/*" : 
                        "*"
                    }
                    disabled={isUploading}
                />
                <div className="mt-4 p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
                    <div className="flex flex-col items-center justify-center">
                        {isUploading ? (
                            <svg className="animate-spin w-6 h-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2" />
                        )}
                        <p className="text-gray-600 group-hover:text-blue-600 font-medium text-sm">
                            {isUploading ? "Uploading..." : "Click to upload"}
                        </p>
                    </div>
                </div>
            </label>
        </div>
    );
};

const ContentItem = ({ item, type, onDelete }) => {
    const getTypeColor = () => {
        switch(type) {
            case "PDF": return "bg-blue-100 text-blue-600";
            case "Video": return "bg-red-100 text-red-600";
            case "Workshop": return "bg-green-100 text-green-600";
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
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-800 truncate" title={item.name}>{item.name}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getPlanBadge(item.plan)}`}>
                                {item.plan || "Free"}
                            </span>
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
    
    // NEW: State to track selected plan before uploading
    const [selectedPlan, setSelectedPlan] = useState("Free");

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

    const handleFileUpload = async (file, type) => {
        if (!file || isUploading) return;

        setIsUploading(true);
        setUploadProgress(0);
        
        const newDocRef = doc(collection(db, "contents"));
        const docId = newDocRef.id;

        const storagePath = `content_uploads/${type}/${Date.now()}_${file.name}`;
        const fileRef = storageRef(storage, storagePath); 
        
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                alert(`File upload failed: ${error.message}`);
                setIsUploading(false);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    await setDoc(newDocRef, {
                        documentId: docId,
                        name: file.name,
                        type: type,
                        plan: selectedPlan, // SAVING THE SELECTED PLAN
                        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                        date: new Date().toISOString(), 
                        url: downloadURL, 
                        storagePath: storagePath 
                    });
                    
                  
                } catch (e) {
                    console.error("Error saving metadata: ", e);
                } finally {
                    setIsUploading(false);
                    setUploadProgress(0);
                }
            }
        );
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
        (item.plan && item.plan.toLowerCase().includes(searchTerm.toLowerCase()))
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

            <div className="mb-4">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Step 2: Upload Files for {selectedPlan}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <FileUploadCard
                        title="Upload PDFs"
                        description="Study materials and guides"
                        icon={FileText}
                        color="bg-blue-500"
                        onFileSelect={(file) => handleFileUpload(file, "PDF")}
                        isUploading={isUploading}
                    />
                    <FileUploadCard
                        title="Upload Videos"
                        description="Tutorials and lectures"
                        icon={Video}
                        color="bg-red-500"
                        onFileSelect={(file) => handleFileUpload(file, "Video")}
                        isUploading={isUploading}
                    />
                    <FileUploadCard
                        title="Upload Workshops"
                        description="Projects and templates"
                        icon={Package}
                        color="bg-green-500"
                        onFileSelect={(file) => handleFileUpload(file, "Workshop")}
                        isUploading={isUploading}
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
                            />
                        ))
                    ) : (
                        <div className="text-center p-8 text-gray-400">
                            <p>No results found for your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}