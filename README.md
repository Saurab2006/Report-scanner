# ReportScan - Medical Report Analysis Tool

A modern, mobile-first medical report scanner built with Next.js and powered by Google Gemini AI. Upload or capture medical reports and get instant AI-powered analysis with support for English and नेपाली.

## Key Features

- **AI-Powered Analysis**: Uses Google Gemini 2.0 to intelligently extract and interpret medical laboratory test results from images and PDFs
- **Multimodal Support**: Analyze JPG, PNG, and PDF medical reports
- **Accurate Extraction**: Extracts test names, values, units, reference ranges, and abnormal findings
- **Educational Explanations**: Provides patient-safe, non-diagnostic explanations
- **Bilingual**: Full support for English and नेपाली (Nepali)
- **Mobile-First Design**: Optimized for smartphones, tablets, and desktops
- **Database Storage**: Stores analysis results in MongoDB for retrieval and tracking
- **Real-Time Health Status**: API endpoint to check Gemini, MongoDB, and server health
- **Safety First**: Never diagnoses, prescribes, or replaces professional medical advice

## Technology Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes (Node.js)
- **AI**: Google Generative AI (Gemini 2.0)
- **Database**: MongoDB
- **Validation**: File magic bytes, MIME type checking, JSON schema validation

## Important Medical Safety Note

**ReportScan is for educational support only.** It does not:
- Diagnose diseases or medical conditions
- Prescribe medications or dosages
- Replace a qualified healthcare professional
- Make clinical recommendations

If a value cannot be reliably read, ReportScan clearly marks it as "unknown" or "needs review" rather than guessing. Always consult a qualified healthcare provider for medical concerns.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or cloud)
- Google Generative AI API key

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file (or `.env` for development) with:

```bash
# Google Gemini AI Configuration
GEMINI_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-2.0-flash
GEMINI_TIMEOUT_MS=45000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=reportscan

# Upload Configuration
MAX_UPLOAD_MB=15
```

**Note**: Never commit `.env` or `.env.local` to version control. Use `.env.example` as a template.

### Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API key"
3. Create or select a project
4. Generate a new API key
5. Copy and paste into your `.env.local`

### Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally, then set:
MONGODB_URI=mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a database user
4. Get connection string
5. Replace in `.env.local`

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### POST `/api/analyze`

Uploads and analyzes a medical report.

**Request:**
- Form data with file field (multipart/form-data)
- Supported types: JPG, PNG, PDF
- Max size: 15 MB (configurable)

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "507f1f77bcf86cd799439011",
    "fileName": "lab-results.jpg",
    "status": "success",
    "summary": "Report successfully analyzed",
    "results": [
      {
        "testName": "Hemoglobin",
        "value": "10.2",
        "unit": "g/dL",
        "referenceRange": "12-16",
        "status": "low",
        "explanation": "This result may indicate lower than normal oxygen-carrying protein levels..."
      }
    ],
    "statusCounts": {
      "high": 0,
      "normal": 8,
      "low": 1,
      "needs_review": 0
    },
    "saved": true
  }
}
```

### GET `/api/health`

Checks server health and component status.

**Response:**
```json
{
  "server": "ok",
  "mongodb": "connected",
  "gemini": "configured",
  "model": "gemini-2.0-flash"
}
```

## Frontend Pages

- **`/`** - Home page with app overview
- **`/scan`** - Upload/scan report page
- **`/report/analysis`** - Analysis results dashboard

## Database Schema

### Reports Collection

```javascript
{
  _id: ObjectId,
  originalFilename: String,
  mimeType: String,           // "image/jpeg", "image/png", "application/pdf"
  fileSize: Number,           // in bytes
  uploadTimestamp: Date,
  processingStatus: String,   // "processing", "complete", "needs_review", "failed"
  analysisStatus: String,     // "pending", "success", "unreadable", "error"
  geminiAnalysis: {           // Full Gemini response
    status: String,
    summary: String,
    results: Array,
    abnormalFindings: Array,
    normalFindings: Array,
    recommendations: Array,
    confidence: String
  },
  analysisTimestamp: Date,
  error: {
    code: String,
    message: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Upload Flow

1. User selects/captures report image
2. Frontend validates file (type, size, magic bytes)
3. Frontend sends to `/api/analyze`
4. Backend validates file again
5. Backend sends to Gemini with image data
6. Gemini analyzes and returns structured JSON
7. Backend validates response structure
8. Backend stores in MongoDB
9. Frontend displays results dashboard
10. User can scan another report or go home

## Error Handling

The app handles:
- **File Errors**: Empty, corrupted, unsupported, too large
- **Gemini Errors**: Timeout, rate limit, auth failure, malformed response
- **MongoDB Errors**: Connection failure, unavailable
- **Network Errors**: Upload failures, API timeouts

All errors are logged server-side (without exposing secrets) and user-friendly messages are shown to the frontend.

## Security

- ✅ Gemini API key stored only on server (never in frontend)
- ✅ MongoDB credentials in environment variables only
- ✅ File magic byte validation before processing
- ✅ MIME type checking
- ✅ Request size limits
- ✅ No hardcoded secrets in source code
- ✅ `.env` files in `.gitignore`

## Development

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run typecheck
```

## Testing Checklist

- [ ] Upload valid JPG medical report
- [ ] Upload valid PNG medical report
- [ ] Upload valid PDF medical report
- [ ] Upload corrupted file (rejected)
- [ ] Upload unsupported file type (rejected)
- [ ] Upload file > 15 MB (rejected)
- [ ] Verify results display correctly
- [ ] Test on mobile (320px, 375px, 768px)
- [ ] Test on desktop (1024px, 1440px)
- [ ] Check health endpoint `/api/health`
- [ ] Verify MongoDB saves results
- [ ] Test without Gemini API key (error message)
- [ ] Test without MongoDB connection (still works, local only)

## Troubleshooting

**"Gemini API key is not configured"**
- Set `GEMINI_API_KEY` in `.env.local`
- Restart dev server

**"MongoDB is unavailable"**
- Check MongoDB connection string in `.env.local`
- Verify MongoDB instance is running
- Check network/firewall rules

**"Gemini took too long"**
- App will retry
- Check internet connection
- Verify API key has quota remaining

**"File did not upload"**
- Check file size (max 15 MB)
- Verify file type (JPG, PNG, PDF only)
- Ensure report image is clear

## Contributing

This is an educational project. Contributions welcome!

## License

MIT

## Medical Disclaimer

ReportScan is a tool for educational purposes only. It is not a medical device, does not diagnose conditions, and does not replace professional medical advice. Always consult qualified healthcare professionals for medical concerns.
