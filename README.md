# THE WAR ROOM 🎯

A specialized, multi-LLM strategic interface utilizing a **Dynamic Fan-Out Architecture**. The War Room generates diverse adversarial and complementary perspectives on any problem by querying multiple AI models in parallel through [OpenRouter](https://openrouter.ai).

![War Room Demo](war_room_demo.gif)

## Features

- **Multi-LLM Analysis**: Query multiple AI models simultaneously (Claude, GPT, Gemini, etc.)
- **Capability Classes**: Different deployment strategies (Strategic, Operational, Tactical, Support, All)
- **Demo Mode**: Try the interface with hardcoded responses before adding an API key
- **Session Persistence**: Chat history saved in browser localStorage
- **Responsive Grid Layout**: Officer responses displayed side-by-side
- **Real-time Updates**: Parallel execution with loading indicators

## Demo Mode vs Live Mode

### Demo Mode (Default for Vercel Deployment)
- Shows hardcoded sample responses to demonstrate the UI
- No API key required
- Perfect for showcasing the interface
- Users can see how multi-LLM analysis works

### Live Mode
- Users can add their own OpenRouter API key
- Connects to real AI models
- API key stored in session only (cleared on tab close)
- Supports all OpenRouter models

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/harris-mohamed/war-room.git
cd war-room
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

For local development with your own API key, edit `.env`:
```bash
OPENROUTER_API_KEY=your-key-here
NEXT_PUBLIC_DEMO_MODE=false
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel

### Option 1: Deploy with Demo Mode (Recommended)

This allows users to see the interface with sample responses and optionally add their own API key.

1. Fork this repository
2. Import to Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_DEMO_MODE` = `true`
4. Deploy!

Users can then add their own OpenRouter API key through the banner at the top of the interface.

### Option 2: Deploy with Your API Key

If you want to provide API access for users:

1. Get an API key from [OpenRouter](https://openrouter.ai/keys)
2. Add environment variables in Vercel:
   - `OPENROUTER_API_KEY` = `your-key-here`
   - `NEXT_PUBLIC_DEMO_MODE` = `false` (or omit)
3. Deploy

**Note**: Be aware of API costs if deploying with your own key!

## Configuration

### Officers (AI Models)

Officers are configured in `/config/roster.json`. Each officer has:
- **Model**: OpenRouter model slug (e.g., `anthropic/claude-sonnet-4.5`)
- **Specialty**: Area of expertise
- **System Prompt**: Instructions for the model
- **Capability Class**: Strategic, Operational, Tactical, or Support

### Capability Classes

- **Strategic**: Top-tier models for critical decisions
- **Operational**: Production-grade balanced response
- **Tactical**: Fast specialist models
- **Support**: Efficient cost-effective models
- **All**: Full council deployment

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **LLM Gateway**: OpenRouter API
- **Deployment**: Vercel
- **Data**: LocalStorage (client-side persistence)

## Architecture

The War Room uses a **Dynamic Fan-Out Architecture**:
1. User sends a message
2. System determines which officers to deploy based on mission mode
3. All officers are queried in parallel via OpenRouter
4. Responses are aggregated and displayed in a grid layout

This approach provides:
- Diverse perspectives from different models
- Parallel execution for speed
- Adversarial analysis (Red Team officer)
- Specialization by role

## Cost Optimization

- **Prompt Caching**: System prompts are cached by OpenRouter (90% cost reduction)
- **Demo Mode**: Run without API costs for demonstrations
- **User-Provided Keys**: Let users bring their own API access
- **OpenRouter Credits**: Use prepaid credits for hard spending caps

## Learn More

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

## License

MIT
