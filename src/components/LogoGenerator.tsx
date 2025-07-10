import React from "react";
import Image from 'next/image';
import { Loader2, Download, RefreshCw, Palette, Type, Sparkles, Wand2, Heart, Share2, Zap } from 'lucide-react';

type GeneratedLogo = {
  id: number;
  url: string;
  prompt: string;
  style: string;
  colors: string[];
  liked: boolean;
  variations: number;
};

type FormData = {
  companyName: string;
  industry: string;
  style: string;
  colors: string[];
  description: string;
  keywords: string;
  mood: string;
};

const LogoGenerator: React.FC = () => {
  const [formData, setFormData] = React.useState<FormData>({
    companyName: '',
    industry: '',
    style: '',
    colors: [],
    description: '',
    keywords: '',
    mood: ''
  });

  const [generatedLogos, setGeneratedLogos] = React.useState<GeneratedLogo[]>([]);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [customColors, setCustomColors] = React.useState<string[]>(['#3B82F6', '#10B981']);
  const [generationProgress, setGenerationProgress] = React.useState<number>(0);
  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false);

  const industries = [
    { name: 'Technology', icon: '💻', keywords: 'innovation, digital, future' },
    { name: 'Healthcare', icon: '🏥', keywords: 'care, wellness, medical' },
    { name: 'Finance', icon: '💰', keywords: 'trust, security, growth' },
    { name: 'Education', icon: '📚', keywords: 'learning, knowledge, growth' },
    { name: 'Retail', icon: '🛍️', keywords: 'shopping, lifestyle, trends' },
    { name: 'Food & Beverage', icon: '🍕', keywords: 'taste, quality, fresh' },
    { name: 'Real Estate', icon: '🏠', keywords: 'home, investment, luxury' },
    { name: 'Fashion', icon: '👗', keywords: 'style, elegance, trends' },
    { name: 'Sports', icon: '⚽', keywords: 'energy, performance, victory' },
    { name: 'Automotive', icon: '🚗', keywords: 'speed, reliability, innovation' }
  ];

  const styles = [
    { name: 'Modern', desc: 'Clean, minimalist design', preview: '🔷' },
    { name: 'Luxury', desc: 'Elegant and sophisticated', preview: '💎' },
    { name: 'Playful', desc: 'Fun and creative', preview: '🎨' },
    { name: 'Professional', desc: 'Corporate and trustworthy', preview: '🏢' },
    { name: 'Vintage', desc: 'Classic and timeless', preview: '🕰️' },
    { name: 'Bold', desc: 'Strong and impactful', preview: '⚡' },
    { name: 'Organic', desc: 'Natural and flowing', preview: '🌿' },
    { name: 'Geometric', desc: 'Structured and precise', preview: '🔸' }
  ];

  const colorPalettes = [
    { name: 'Blue Ocean', colors: ['#3B82F6', '#1E40AF', '#60A5FA'], mood: 'Professional' },
    { name: 'Forest Green', colors: ['#10B981', '#065F46', '#34D399'], mood: 'Natural' },
    { name: 'Sunset Orange', colors: ['#F59E0B', '#D97706', '#FBBF24'], mood: 'Energetic' },
    { name: 'Royal Purple', colors: ['#8B5CF6', '#6D28D9', '#A78BFA'], mood: 'Luxury' },
    { name: 'Rose Gold', colors: ['#F43F5E', '#BE185D', '#FB7185'], mood: 'Elegant' },
    { name: 'Monochrome', colors: ['#1F2937', '#6B7280', '#9CA3AF'], mood: 'Minimal' },
    { name: 'Coral Reef', colors: ['#FF6B6B', '#FF8E8E', '#FFA8A8'], mood: 'Vibrant' },
    { name: 'Deep Sea', colors: ['#0F172A', '#1E293B', '#334155'], mood: 'Sophisticated' }
  ];

  const moods = [
    { name: 'Trustworthy', icon: '🤝', desc: 'Reliable and dependable' },
    { name: 'Innovative', icon: '🚀', desc: 'Forward-thinking and creative' },
    { name: 'Friendly', icon: '😊', desc: 'Approachable and warm' },
    { name: 'Sophisticated', icon: '🎭', desc: 'Refined and elegant' },
    { name: 'Energetic', icon: '⚡', desc: 'Dynamic and vibrant' },
    { name: 'Calm', icon: '🧘', desc: 'Peaceful and serene' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorPaletteSelect = (colors: string[]) => {
    setCustomColors(colors);
    setFormData((prev: FormData) => ({
      ...prev,
      colors: colors
    }));
  };

  const generateLogos = async () => {
    if (!formData.companyName.trim()) {
      alert('Please enter a company name');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev: number) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // Build prompt from formData
      const prompt = `${formData.style} logo for ${formData.companyName} in ${formData.industry} style, colors: ${formData.colors.join(', ')}, mood: ${formData.mood}, keywords: ${formData.keywords}, description: ${formData.description}`;

      // Call your OpenAI image generation API
      const response = await fetch('/src/app/pages/API/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate image');
      const data = await response.json();

      // Use the returned image URL
      const mockLogos: GeneratedLogo[] = [{
        id: Date.now(),
        url: data.imageUrl,
        prompt,
        style: formData.style,
        colors: formData.colors.length > 0 ? formData.colors : customColors,
        liked: false,
        variations: 0
      }];

      setGenerationProgress(100);
      setGeneratedLogos(mockLogos);
    } catch (error) {
      console.error('Error generating logos:', error);
      alert('Failed to generate logos. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const downloadLogo = (logo: GeneratedLogo) => {
    const link = document.createElement('a');
    link.href = logo.url;
    link.download = `${formData.companyName}-logo-${logo.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleLike = (logoId: number) => {
    setGeneratedLogos((prev: GeneratedLogo[]) => 
      prev.map((logo: GeneratedLogo) => 
        logo.id === logoId ? { ...logo, liked: !logo.liked } : logo
      )
    );
  };

  const regenerateVariation = async (logo: GeneratedLogo) => {
    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const newLogo: GeneratedLogo = {
      ...logo,
      id: Date.now(),
      url: `https://picsum.photos/400/400?random=${Date.now()}`,
      variations: logo.variations + 1
    };

    setGeneratedLogos((prev: GeneratedLogo[]) => prev.map((l: GeneratedLogo) => l.id === logo.id ? newLogo : l));
    setIsGenerating(false);
  };

  const getSelectedIndustry = () => {
    return industries.find(ind => ind.name === formData.industry);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Sparkles className="mr-3 text-blue-500" size={36} />
            AI Logo Generator
          </h1>
          <p className="text-xl text-gray-600">Create stunning logos powered by advanced AI</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Wand2 className="mr-2 text-blue-500" size={20} />
                Brand Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {industries.slice(0, 8).map(industry => (
                      <button
                        key={industry.name}
                        onClick={() => handleInputChange('industry', industry.name)}
                        className={`p-2 rounded-md text-left transition-all ${
                          formData.industry === industry.name
                            ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                            : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{industry.icon}</span>
                          <span className="text-sm font-medium">{industry.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {getSelectedIndustry() && (
                    <p className="text-xs text-gray-500 mt-2">
                      Keywords: {getSelectedIndustry()?.keywords}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Mood
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {moods.map(mood => (
                      <button
                        key={mood.name}
                        onClick={() => handleInputChange('mood', mood.name)}
                        className={`p-2 rounded-md text-left transition-all ${
                          formData.mood === mood.name
                            ? 'bg-purple-100 border-2 border-purple-500 text-purple-800'
                            : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{mood.icon}</span>
                          <div>
                            <div className="text-sm font-medium">{mood.name}</div>
                            <div className="text-xs text-gray-500">{mood.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                  </button>
                  
                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Keywords (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={formData.keywords}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('keywords', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="modern, tech, innovation"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe your brand personality..."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Type className="mr-2 text-purple-500" size={20} />
                Logo Style
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {styles.map(style => (
                  <div
                    key={style.name}
                    onClick={() => handleInputChange('style', style.name)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      formData.style === style.name
                        ? 'bg-blue-100 border-2 border-blue-500 transform scale-105'
                        : 'bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{style.preview}</div>
                      <div className="font-medium text-gray-900 text-sm">{style.name}</div>
                      <div className="text-xs text-gray-600">{style.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Palette className="mr-2 text-green-500" size={20} />
                Color Palette
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {colorPalettes.map(palette => (
                  <div
                    key={palette.name}
                    onClick={() => handleColorPaletteSelect(palette.colors)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      JSON.stringify(formData.colors) === JSON.stringify(palette.colors)
                        ? 'bg-blue-100 border-2 border-blue-500 transform scale-105'
                        : 'bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium text-gray-900 text-sm mb-1">{palette.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{palette.mood}</div>
                      <div className="flex justify-center space-x-1">
                        {palette.colors.map((color: string, index: number) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateLogos}
              disabled={isGenerating || !formData.companyName.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:scale-100"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <div>
                    <div>Generating Logos...</div>
                    <div className="text-xs opacity-75">{generationProgress}% complete</div>
                  </div>
                </div>
              ) : (
                <>
                  <Zap className="mr-2 inline" size={20} />
                  Generate AI Logos
                </>
              )}
            </button>

            {isGenerating && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
                <span>Generated Logos</span>
                {generatedLogos.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {generatedLogos.length} designs created
                  </span>
                )}
              </h2>

              {generatedLogos.length === 0 && !isGenerating ? (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Sparkles size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-600 text-lg">Your AI-generated logos will appear here</p>
                  <p className="text-gray-500 text-sm mt-2">Fill in the details and click generate to start creating</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedLogos.map(logo => (
                    <div key={logo.id} className="group bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-all">
                      <div className="aspect-square bg-white rounded-lg mb-3 overflow-hidden relative">
                        <Image
                          src={logo.url}
                          alt={logo.prompt}
                          width={256}
                          height={256}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-600">
                          <div className="font-medium">{logo.style} Style</div>
                          {logo.variations > 0 && (
                            <div className="text-xs text-gray-500">
                              Variation #{logo.variations}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {logo.colors.map((color: string, index: number) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleLike(logo.id)}
                            className={`p-2 rounded-full transition-colors ${
                              logo.liked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-500'
                            }`}
                            title="Like this logo"
                          >
                            <Heart size={16} fill={logo.liked ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => regenerateVariation(logo)}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                            title="Generate variation"
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50"
                            title="Share logo"
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => downloadLogo(logo)}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm transition-colors"
                        >
                          <Download size={14} />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isGenerating && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <div className="w-16 h-16 mx-auto mb-4 opacity-0">placeholder</div>
                  </div>
                  <p className="text-gray-600 text-lg">AI is crafting your perfect logos...</p>
                  <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoGenerator;