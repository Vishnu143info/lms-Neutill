import React, { useState, useEffect } from "react";
// Using lucide-react icons
import { Upload, FileText, Video, Package, Clock, Download, Eye, Trash2, Search } from "lucide-react";

// Import Firebase services and methods
// NOTE: setDoc is required for explicitly setting the ID
import { 
    storage, 
    db, 
    collection, 
    setDoc, // Confirmed: setDoc is used for pre-generated IDs
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
            e.target.value = null; // Reset input field to allow uploading same file again
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
                    {/* Reduced description font size slightly for better fit on small cards */}
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
    
    const formatDate = (isoString) => {
        if (item.date === "Just now") return "Just now";
        try {
            return new Date(isoString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch {
            return "Unknown Date";
        }
    }

    return (
        <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md transition-shadow">
            {/* Mobile-Friendly Layout: Use flex-col on small screens, then row on medium */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-grow min-w-0"> {/* Use min-w-0 to allow truncation */}
                    <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor()}`}>
                        {type === "PDF" && <FileText className="w-4 h-4" />}
                        {type === "Video" && <Video className="w-4 h-4" />}
                        {type === "Workshop" && <Package className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                        {/* Truncate long file names */}
                        <p className="font-medium text-gray-800 truncate" title={item.name}>{item.name}</p>
                        {/* Detail bar stacks better on small screens */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                            <span className="flex-shrink-0">{item.type}</span>
                            <span className="flex-shrink-0 hidden sm:inline">•</span>
                            <span className="flex-shrink-0 hidden sm:inline">{item.size}</span>
                            <span className="flex-shrink-0 hidden sm:inline">•</span>
                            <span className="flex items-center gap-1 flex-shrink-0">
                                <Clock className="w-3 h-3" />
                                {formatDate(item.date)}
                            </span>
                            <span className="text-xs text-gray-400 truncate max-w-[80px] sm:max-w-none" title={`Firestore ID: ${item.id}`}>
                                ID: {item.id} 
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Action buttons on the right, always visible */}
                <div className="flex items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
                    <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View File"
                    >
                        <Eye className="w-4 h-4 text-gray-600" />
                    </a>
                    <a 
                        href={item.url} 
                        download={item.name} 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download File"
                    >
                        <Download className="w-4 h-4 text-gray-600" />
                    </a>
                    <button 
                        onClick={() => onDelete(item.id, item.storagePath)} 
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete File"
                    >
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

    // 1. FETCH DATA (Real-time listener)
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

    // 2. UNIFIED UPLOAD FUNCTION (Storage and Firestore)
    const handleFileUpload = async (file, type) => {
        if (!file || isUploading) return;

        setIsUploading(true);
        setUploadProgress(0);
        
        // Pre-generate Firestore ID
        const newDocRef = doc(collection(db, "contents"));
        const docId = newDocRef.id; // Store the generated ID

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
                setUploadProgress(0);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Use setDoc and include the ID as a field
                    await setDoc(newDocRef, {
                        documentId: docId, // The explicitly stored ID field
                        name: file.name,
                        type: type,
                        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                        date: new Date().toISOString(), 
                        url: downloadURL, 
                        storagePath: storagePath 
                    });
                    
                    console.log('File uploaded and metadata saved to Firestore!');
                    alert("File uploaded successfully!");

                } catch (e) {
                    console.error("Error saving metadata: ", e);
                    alert("Metadata saving failed. File might be in storage, but the link is missing.");
                } finally {
                    setIsUploading(false);
                    setUploadProgress(0);
                }
            }
        );
    };

    const uploadPDF = (file) => handleFileUpload(file, "PDF");
    const uploadVideo = (file) => handleFileUpload(file, "Video");
    const uploadWorkshop = (file) => handleFileUpload(file, "Workshop");

    // 3. DELETE FUNCTION (Firestore and Storage)
    const deleteItem = async (id, storagePath) => {
        if (!window.confirm("Are you sure you want to delete this content? This action is irreversible.")) {
            return;
        }

        try {
            // 1. Delete the file from Firebase Storage
            const fileRef = storageRef(storage, storagePath);
            await deleteObject(fileRef);
            console.log("File successfully deleted from Firebase Storage!");

            // 2. Delete metadata from Firestore
            await deleteDoc(doc(db, "contents", id));
            console.log("Document successfully deleted from Firestore!");
            
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                console.warn("Storage object not found. Deleting Firestore record only.");
                await deleteDoc(doc(db, "contents", id)); 
            } else {
                console.error("Error deleting content: ", error);
                alert(`Deletion failed: ${error.message}`);
            }
        }
    };

    // 4. SEARCH/FILTER LOGIC
    // This is the core logic that makes the search functional
    const filteredContents = contents.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                    📚 Content Manager
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">Upload and manage your educational content</p>
            </div>

            {/* Upload Cards: Stacks on mobile, 3 columns on medium screens and up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <FileUploadCard
                    title="Upload PDFs"
                    description="Study materials, notes, and guides"
                    icon={FileText}
                    color="bg-blue-500"
                    onFileSelect={uploadPDF}
                    isUploading={isUploading}
                />
                <FileUploadCard
                    title="Upload Videos"
                    description="Tutorials, lectures, and demos"
                    icon={Video}
                    color="bg-red-500"
                    onFileSelect={uploadVideo}
                    isUploading={isUploading}
                />
                <FileUploadCard
                    title="Upload Workshops"
                    description="Projects, templates, and resources"
                    icon={Package}
                    color="bg-green-500"
                    onFileSelect={uploadWorkshop}
                    isUploading={isUploading}
                />
            </div>
            
            {/* Upload Progress Bar */}
            {isUploading && (
                <div className="mb-4 bg-blue-100 rounded-full h-2.5 dark:bg-blue-900">
                    <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-xs text-blue-600 text-center mt-1 font-medium">
                        Uploading: {uploadProgress.toFixed(0)}%
                    </p>
                </div>
            )}


            {/* Content Library */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Content Library</h2>
                        <p className="text-gray-600 text-sm">Manage all your uploaded files ({contents.length} total)</p>
                    </div>
                    {/* Search bar takes full width on mobile, then snaps back */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
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
                        <div className="text-center p-8 text-gray-500">
                            <FileText className="w-10 h-10 mx-auto mb-3" />
                            <p>No content found. Start by uploading a file or try a different search term.</p>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{contents.filter(c => c.type === "PDF").length}</p>
                        <p className="text-gray-600 text-sm">PDFs</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{contents.filter(c => c.type === "Video").length}</p>
                        <p className="text-gray-600 text-sm">Videos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{contents.filter(c => c.type === "Workshop").length}</p>
                        <p className="text-gray-600 text-sm">Workshops</p>
                    </div>
                </div>
            </div>
        </div>
    );
}