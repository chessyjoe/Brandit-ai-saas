import React, { useState } from 'react';
import { Wand2, Copy, Download, RefreshCw, Sparkles, Target, Heart, Zap } from 'lucide-react';
type ResultType = 'slogan' | 'mission' | 'values' | 'story';
type Result = {
  id: string;
  text: string;
  type: ResultType;
};

const SloganTextGenerator = () => {
  const [activeTab, setActiveTab] = useState<ResultType>('slogan');
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [tone, setTone] = useState('professional');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Food & Beverage',
    'Fitness', 'Beauty', 'Travel', 'Real Estate', 'Automotive', 'Entertainment',
    'Consulting', 'Manufacturing', 'Other'
  ];

  const tones = [
    { value: 'professional', label: 'Professional', icon: Target },
    { value: 'friendly', label: 'Friendly', icon: Heart },
    { value: 'bold', label: 'Bold', icon: Zap },
    { value: 'playful', label: 'Playful', icon: Sparkles }
  ];

  const sampleSlogans = [
    "Innovation at your fingertips",
    "Where quality meets excellence",
    "Your success, our passion",
    "Empowering tomorrow, today",
    "Experience the difference",
    "Beyond expectations, every time",
    "Crafting your digital future",
    "Where dreams become reality"
  ];

  const sampleMissions = [
    "To empower businesses with innovative solutions that drive growth and create lasting value for our clients and communities.",
    "We are committed to delivering exceptional quality and service while fostering sustainable practices that benefit our planet.",
    "Our mission is to make cutting-edge technology accessible to everyone, breaking down barriers and creating opportunities for all.",
    "We exist to inspire and enable our customers to achieve their goals through personalized, reliable, and innovative solutions."
  ];

  const sampleValues = [
    "• Integrity: We conduct business with honesty and transparency\n• Innovation: We embrace change and drive continuous improvement\n• Excellence: We strive for the highest standards in everything we do\n• Collaboration: We believe in the power of teamwork and partnership",
    "• Customer-First: Your success is our priority\n• Quality: We never compromise on the standards we set\n• Sustainability: We care for our planet and future generations\n• Growth: We invest in our people and communities",
    "• Authenticity: We stay true to our values and commitments\n• Empowerment: We enable others to reach their full potential\n• Reliability: We deliver on our promises, every time\n• Innovation: We challenge the status quo and embrace new ideas"
  ];

  const sampleStories = [
    "Founded in 2020 with a simple vision: to bridge the gap between cutting-edge technology and everyday business needs. Our journey began when our founders recognized that small businesses were being left behind in the digital transformation. Today, we're proud to serve thousands of clients worldwide, helping them harness the power of innovation to grow and thrive in an ever-changing marketplace.",
    "What started as a weekend project in a garage has evolved into a mission-driven company that's reshaping the industry. Our story is one of perseverance, innovation, and an unwavering commitment to our customers. From our humble beginnings to becoming a trusted partner for businesses of all sizes, we've never lost sight of our core belief: that great things happen when passion meets purpose.",
    "Our company was born from a frustration with the status quo. We saw an industry that had become complacent, where customers were treated as transactions rather than partners. We knew there had to be a better way. Today, we're not just a business – we're a movement, dedicated to creating meaningful relationships and delivering value that extends far beyond the bottom line."
  ];

  const handleGenerate = async () => {
    if (!brandName.trim()) {
      alert('Please enter a brand name');
      return;
    }

    setIsGenerating(true);

    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let newResults: Result[] = [];

    if (activeTab === 'slogan') {
      newResults = sampleSlogans.map(slogan => ({
        id: Math.random().toString(36).substr(2, 9),
        text: slogan.replace(/\b\w+\b/g, (word, index) => {
          if (index < 20 && Math.random() > 0.7) {
            return brandName;
          }
          return word;
        }),
        type: 'slogan'
      }));
    } else if (activeTab === 'mission') {
      newResults = sampleMissions.map(mission => ({
        id: Math.random().toString(36).substr(2, 9),
        text: mission,
        type: 'mission'
      }));
    } else if (activeTab === 'values') {
      newResults = sampleValues.map(values => ({
        id: Math.random().toString(36).substr(2, 9),
        text: values,
        type: 'values'
      }));
    } else if (activeTab === 'story') {
      newResults = sampleStories.map(story => ({
        id: Math.random().toString(36).substr(2, 9),
        text: story,
        type: 'story'
      }));
    }

    setResults(newResults);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const exportResults = () => {
    const exportData = results.map(result => result.text).join('\n\n');
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandName}_${activeTab}_ideas.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <Wand2 className="text-purple-600" size={36} />
          AI Brand Text Generator
        </h1>
        <p className="text-gray-600 text-lg">Create compelling slogans, missions, and brand stories with AI</p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter your brand name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select industry</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {tones.map(toneOption => (
                <option key={toneOption.value} value={toneOption.value}>
                  {toneOption.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords (optional)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="innovation, quality, trust"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tone Selection Visual */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tones.map(toneOption => {
            const IconComponent = toneOption.icon;
            return (
              <button
                key={toneOption.value}
                onClick={() => setTone(toneOption.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  tone === toneOption.value
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent size={16} />
                {toneOption.label}
              </button>
            );
          })}
        </div>

        {/* Content Type Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'slogan', label: 'Slogans & Taglines' },
            { key: 'mission', label: 'Mission Statements' },
            { key: 'values', label: 'Core Values' },
            { key: 'story', label: 'Brand Stories' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as ResultType)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate {activeTab === 'slogan' ? 'Slogans' : activeTab === 'mission' ? 'Mission Statements' : activeTab === 'values' ? 'Core Values' : 'Brand Stories'}
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Generated {activeTab === 'slogan' ? 'Slogans' : activeTab === 'mission' ? 'Mission Statements' : activeTab === 'values' ? 'Core Values' : 'Brand Stories'}
            </h2>
            <button
              onClick={exportResults}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Export All
            </button>
          </div>

          <div className="space-y-4">
            {results.map(result => (
              <div
                key={result.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {result.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(result.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        favorites.includes(result.id)
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart size={16} fill={favorites.includes(result.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => copyToClipboard(result.text)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SloganTextGenerator;