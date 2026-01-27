# Vercel Deployment Guide

## Quick Deploy (Demo Mode)

1. **Push the vercel-demo branch to GitHub:**
   ```bash
   git push -u origin vercel-demo
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository
   - Choose the `vercel-demo` branch
   - Click "Import"

3. **Configure Environment Variables:**
   Add this in the Vercel dashboard:
   - Key: `NEXT_PUBLIC_DEMO_MODE`
   - Value: `true`

   Optional (for branding):
   - `NEXT_PUBLIC_SITE_NAME` = `War Room`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app`

4. **Deploy!**
   Vercel will automatically build and deploy your app.

## How Demo Mode Works

### Default Behavior (No API Key)
- Shows a blue/purple banner: "Demo Mode"
- Displays hardcoded responses for "Analyze Evernote's downfall."
- Includes realistic analysis from 4 officers:
  - O1 (Chief of Operations) - Executive analysis
  - O2 (Intelligence Officer) - Data synthesis
  - O3 (Red Team Lead) - Critical assessment
  - O4 (Logistics Officer) - Infrastructure analysis

### User Adds API Key
1. User clicks "Add API Key" in the banner
2. Enters their OpenRouter API key
3. Key is stored in sessionStorage (cleared on tab close)
4. Banner changes to: "Live Mode Active"
5. All subsequent queries use real AI models

## Testing the Deployment

After deployment:
1. Visit your Vercel URL
2. You should see "Demo Mode" banner at the top
3. Send any message - you'll get the Evernote analysis demo responses
4. Click "Add API Key" to test the live mode flow
5. Try different Mission Modes (General, Research, Audit, Problem Solving)

## Cost Considerations

### Demo Mode
- ✅ **Zero API costs** - runs entirely client-side
- ✅ Showcases the interface and multi-LLM concept
- ✅ Users can try before committing to API costs

### Live Mode (User API Key)
- ✅ Users pay for their own usage
- ✅ No API cost to you as the host
- ⚠️ Users need to sign up for OpenRouter

### Live Mode (Your API Key)
- ⚠️ **Not recommended for public deployment**
- You pay for all user queries
- Can get expensive quickly
- Only suitable for private/internal use

## Monitoring Usage

If users are using their own API keys:
- They can monitor usage at [openrouter.ai](https://openrouter.ai)
- You have zero visibility or cost

If you provide an API key (not recommended):
- Monitor usage in OpenRouter dashboard
- Set spending limits
- Use prepaid credits for hard caps

## Customizing Demo Responses

To change the demo responses:

1. Edit `/lib/openrouter.ts`
2. Modify the `DEMO_RESPONSES` object
3. Each officer (O1, O2, O3, O4) has a string response
4. Use markdown formatting for better display
5. Commit and redeploy

Example:
```typescript
const DEMO_RESPONSES: Record<string, string> = {
  O1: `Your custom response for Officer 1...`,
  O2: `Your custom response for Officer 2...`,
  // etc.
};
```

## Troubleshooting

**Banner not showing?**
- Check that `NEXT_PUBLIC_DEMO_MODE=true` is set in Vercel
- Verify environment variables are set for the production environment
- Redeploy after adding environment variables

**Demo responses not appearing?**
- Check browser console for errors
- Verify the API route is returning data
- Test locally with `NEXT_PUBLIC_DEMO_MODE=true` in `.env`

**User API key not working?**
- Verify the API key is valid (starts with `sk-or-v1-`)
- Check OpenRouter dashboard for API key status
- Ensure OpenRouter account has credits

## Next Steps

- Customize the demo responses for your use case
- Add more officers in `/config/roster.json`
- Customize mission modes
- Add analytics tracking
- Implement rate limiting (if needed)
