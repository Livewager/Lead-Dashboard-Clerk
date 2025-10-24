# 11 Labs Google Sheets Integration

## Overview

Your dashboard now automatically syncs with your 11 Labs Google Sheet to create leads from incoming calls!

## How It Works

### **Automatic Sync Process:**

1. **Every 2 minutes**, the dashboard checks your Google Sheet
2. **Parses call data** from Sheet1 (Timestamp, Direction, To Number, From Number, Transcript, Summary)
3. **Creates new leads** automatically if they don't already exist
4. **Shows notification** when new leads are added
5. **Updates dashboard** with new lead cards

### **Manual Sync:**

Click the **"Sync Calls"** button in the dashboard header anytime to force an immediate sync.

## Sheet Columns Mapping

| Google Sheet Column | Lead Field | How It's Used |
|---------------------|------------|---------------|
| **Timestamp** | created_at | When the call happened |
| **Direction** | (metadata) | Inbound/outbound indicator |
| **To Number** | (metadata) | Your clinic number |
| **From Number** | phone | Lead's phone number |
| **Transcript** | (analysis) | Used for quality scoring |
| **Summary** | summary | Lead description/summary |

## Intelligent Lead Classification

### **Tier Assignment (Automatic):**

The system analyzes the Summary and Transcript to determine lead quality:

- **Platinum** ($75): Keywords like "premium", "luxury", "comprehensive", "full package"
- **Hot** ($45): Keywords like "urgent", "soon", "interested", "ready"
- **Warm** ($25): Default for standard inquiries

### **Quality Score (0-100):**

Base score starts at 60, then adds points for:
- "interested" mentioned: +10
- "ready" mentioned: +10
- "appointment" or "consultation": +10
- Detailed inquiry (>100 chars): +5
- Urgency indicators: +5

### **Location Detection:**

Automatically detects city/region from area code:
- 604, 778, 236 → Vancouver, Metro Vancouver
- 250 → Victoria, Vancouver Island
- Others → British Columbia, Unknown

## API Endpoint

### **GET /api/sync-sheets**

Manually trigger a sync:

```bash
curl https://your-app.vercel.app/api/sync-sheets
```

**Response:**
```json
{
  "success": true,
  "processed": 15,
  "newLeads": 3,
  "message": "Processed 15 rows, created 3 new leads"
}
```

## Features

### ✅ **Automatic Deduplication**
- Checks phone number + timestamp
- Won't create duplicate leads
- Safe to run multiple times

### ✅ **Real-Time Notifications**
- Toast notification when new leads added
- Shows count of processed vs new
- Timestamp of last sync visible

### ✅ **Smart Parsing**
- Handles CSV with quoted fields
- Filters empty rows
- Robust error handling

## Configuration

### **Sync Interval:**

Edit in `src/hooks/useSheetSync.ts`:
```typescript
const interval = setInterval(() => {
  syncSheets()
}, 2 * 60 * 1000) // Change to desired interval
```

### **Google Sheet URL:**

Edit in `src/app/api/sync-sheets/route.ts`:
```typescript
const SHEET_URL = 'your-sheet-csv-url-here'
```

## Monitoring

### **Check Sync Status:**
- Dashboard header shows "Last sync: HH:MM:SS"
- Button shows "Syncing..." when active
- Spinning icon during sync

### **View Logs:**
- Check Vercel function logs
- Console logs show processed rows
- Error messages in toast notifications

## Example Workflow

1. **11 Labs call comes in** → Transcribed → Added to Google Sheet
2. **Dashboard auto-syncs** (every 2 min) → Fetches CSV
3. **System analyzes** call summary → Assigns tier & score
4. **New lead created** in Supabase → Appears in dashboard
5. **Notification shown** → "1 new lead(s) added from calls!"
6. **Real-time update** → Lead card appears with animation

## Benefits

- 🎯 **Zero Manual Entry** - Calls automatically become leads
- 📊 **Smart Categorization** - AI-powered tier and score assignment
- 🔄 **Always Up-to-Date** - Syncs every 2 minutes
- 🚫 **No Duplicates** - Intelligent deduplication
- 📍 **Location Aware** - Auto-detects from phone number
- ⚡ **Instant Visibility** - New leads appear immediately after sync

## Troubleshooting

### No new leads appearing?
- Check Google Sheet is published/accessible
- Verify CSV URL in API route
- Check browser console for errors
- Try manual sync with "Sync Calls" button

### Duplicate leads?
- System prevents duplicates by phone + timestamp
- If seeing duplicates, check timestamp format

### Wrong tier/score?
- Update keyword mapping in `inferLeadTier()` function
- Adjust score calculation in `calculateQualityScore()`

---

**Your 11 Labs calls are now automatically feeding your lead pipeline!** 🎉

