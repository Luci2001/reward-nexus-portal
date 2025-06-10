
# Live JSON Hot Reloading Guide

## Overview

The Reward Nexus Portal now supports live JSON hot reloading, allowing immediate reflection of changes to JSON files without rebuilding or restarting the server, even in production mode.

## Features

### 1. Live JSON Hot Reloading
- **Real-time Updates**: Changes to JSON files are detected and applied instantly
- **Production Support**: Works in both development and production environments
- **Cache Busting**: Automatically bypasses browser cache to ensure fresh data
- **Error Handling**: Graceful error handling with fallback to cached data

### 2. Enhanced npm Commands
```bash
# Primary development command (NEW)
npm start

# Alternative development command (existing)
npm run dev

# Build for production
npm run build

# Preview production build with live JSON support
npm run preview
```

### 3. Supported JSON Files
All JSON files in the `public/data/` directory support live reloading:
- `/public/data/articles.json` - Offers, categories, and reward data
- `/public/data/policies.json` - About us, user policy, contact information
- `/public/data/social_media.json` - Social media links and settings
- `/public/data/ads.json` - Advertisement configuration
- `/public/data/msg.json` - Contact form messages

## How to Use

### Starting the Development Server
```bash
# Use the new primary command
npm start

# Or use the traditional command
npm run dev
```

### Making Live Changes
1. Start the development server using `npm start`
2. Open any JSON file in `public/data/`
3. Make your changes and save the file
4. The website will automatically update within 1-2 seconds
5. No rebuild or restart required!

### Production Deployment
```bash
# Build the project
npm run build

# Preview the production build with live JSON support
npm run preview
```

## Technical Implementation

### Custom Hook: `useLiveJson`
```typescript
const { data, loading, error, refetch } = useLiveJson('/data/articles.json', defaultData, {
  pollingInterval: 1500,
  enableInProduction: true
});
```

**Parameters:**
- `jsonPath`: Path to the JSON file
- `initialData`: Default data structure
- `options`: Configuration object
  - `pollingInterval`: How often to check for changes (ms)
  - `enableInProduction`: Whether to enable in production mode

### Data Manager Hooks
Pre-configured hooks for each JSON file:
```typescript
import { 
  useArticlesData,
  usePoliciesData,
  useSocialMediaData,
  useAdsData,
  useMessagesData 
} from '@/utils/jsonDataManager';
```

### Vite Configuration
Enhanced with:
- JSON file watching in development
- Hot module replacement for JSON files
- Proper asset handling for production builds

## Performance Considerations

### Polling Intervals
- **Articles Data**: 1.5 seconds (frequent updates expected)
- **Policy/Social/Ads Data**: 2 seconds (less frequent updates)
- **Messages Data**: 1 second (real-time messaging)

### Cache Management
- Uses cache-busting query parameters
- Implements `Cache-Control` headers
- Checks `Last-Modified` headers to avoid unnecessary updates

### Production Optimization
- Minimal overhead when no changes detected
- Graceful degradation if JSON files are unavailable
- Error boundaries prevent crashes from malformed JSON

## Troubleshooting

### Common Issues

1. **Changes not reflecting immediately**
   - Check browser console for network errors
   - Verify JSON file syntax using a JSON validator
   - Clear browser cache manually if needed

2. **Performance concerns**
   - Adjust polling intervals in `jsonDataManager.ts`
   - Disable production polling if not needed

3. **JSON syntax errors**
   - Use proper JSON formatting tools
   - Check console for parsing errors
   - Validate JSON structure before saving

### Debug Mode
In development, you'll see a green indicator showing "🔄 Live JSON Updates Active" to confirm the system is working.

### Console Logging
The system provides detailed console logs:
```
[Live JSON] Updated data from /data/articles.json
[JSON HMR] /path/to/file.json changed, triggering reload
```

## Best Practices

1. **JSON Structure**: Maintain consistent JSON structure to avoid breaking changes
2. **Validation**: Validate JSON before saving to prevent syntax errors
3. **Backup**: Keep backups of important JSON files
4. **Testing**: Test changes in development before deploying to production
5. **Performance**: Monitor polling frequency based on your needs

## Migration from Old System

If you were previously loading JSON data manually, replace with the new hooks:

**Before:**
```typescript
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/data/articles.json').then(res => res.json()).then(setData);
}, []);
```

**After:**
```typescript
const { data, loading, error } = useArticlesData();
```

## Support

For issues or questions regarding the live JSON hot reloading system:
1. Check the browser console for error messages
2. Verify JSON file syntax and structure
3. Review the polling intervals in `jsonDataManager.ts`
4. Ensure proper file permissions on JSON files

The system is designed to be robust and production-ready while providing an excellent development experience.
