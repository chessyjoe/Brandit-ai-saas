import React, { useState, useRef, ReactNode, MouseEvent } from 'react';
import { Loader2, Download, RefreshCw, Palette, Type, Layout } from 'lucide-react';
import Image from 'next/image';

// Format presets
const formats = [
	{ name: 'Instagram Post', width: 1080, height: 1080, category: 'Social' },
	{ name: 'Instagram Story', width: 1080, height: 1920, category: 'Social' },
	{ name: 'Facebook Post', width: 1200, height: 630, category: 'Social' },
	{ name: 'Twitter Header', width: 1500, height: 500, category: 'Social' },
	{ name: 'LinkedIn Post', width: 1200, height: 627, category: 'Social' },
	{ name: 'A4 Poster', width: 2480, height: 3508, category: 'Print' },
	{ name: 'Business Card', width: 1050, height: 600, category: 'Print' },
	{ name: 'Web Banner', width: 1920, height: 1080, category: 'Web' },
	{ name: 'YouTube Thumbnail', width: 1280, height: 720, category: 'Web' },
];

const colorThemes = [
	{ name: 'Professional Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#dbeafe' },
	{ name: 'Elegant Black', primary: '#000000', secondary: '#374151', accent: '#f3f4f6' },
	{ name: 'Modern Purple', primary: '#7c3aed', secondary: '#a855f7', accent: '#ede9fe' },
	{ name: 'Vibrant Orange', primary: '#ea580c', secondary: '#f97316', accent: '#fed7aa' },
	{ name: 'Nature Green', primary: '#059669', secondary: '#10b981', accent: '#d1fae5' },
	{ name: 'Sunset Pink', primary: '#e11d48', secondary: '#f43f5e', accent: '#fecdd3' },
];

const textStyles = [
	{ name: 'Bold & Modern', titleFont: 'bold', bodyFont: 'normal' },
	{ name: 'Elegant Serif', titleFont: 'bold', bodyFont: 'normal' },
	{ name: 'Clean Sans', titleFont: 'bold', bodyFont: 'normal' },
	{ name: 'Creative Script', titleFont: 'bold', bodyFont: 'normal' },
];

// --- Types ---
type CardProps = { children: ReactNode; className?: string };
type ButtonProps = {
	children: ReactNode;
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	variant?: 'default' | 'outline' | 'secondary';
	size?: 'default' | 'sm' | 'lg';
	className?: string;
};
type TabsProps = {
	value: string;
	onValueChange: (value: string) => void;
	children: ReactNode;
};
type TabsListProps = {
	children: ReactNode;
	className?: string;
	activeTab: string;
	onTabChange: (value: string) => void;
};
type TabsTriggerProps = {
	value: string;
	children: ReactNode;
	className?: string;
	activeTab: string;
	onTabChange: (value: string) => void;
	isActive: boolean;
};
type TabsContentProps = {
	value: string;
	children: ReactNode;
	activeTab: string;
	className?: string;
};
type GeneratedImage = { url: string; id: string };

// --- UI Components ---
const Card = ({ children, className = '' }: CardProps) => (
	<div className={`bg-white rounded-lg border shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }: CardProps) => (
	<div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }: CardProps) => (
	<h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }: CardProps) => (
	<div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Button = ({
	children,
	onClick,
	disabled = false,
	variant = 'default',
	size = 'default',
	className = '',
}: ButtonProps) => {
	const baseClasses =
		'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
	const variants: Record<string, string> = {
		default: 'bg-blue-600 text-white hover:bg-blue-700',
		outline: 'border border-gray-300 hover:bg-gray-50',
		secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
	};
	const sizes: Record<string, string> = {
		default: 'h-10 py-2 px-4',
		sm: 'h-9 px-3 text-xs',
		lg: 'h-11 px-8',
	};

	return (
		<button
			className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

const Tabs = ({ value, onValueChange, children }: TabsProps) => (
	<div className="w-full" data-active-tab={value}>
		{React.Children.map(children, (child) => {
			if (React.isValidElement(child)) {
				return React.cloneElement(child, {
					activeTab: value,
					onTabChange: onValueChange,
				} as Partial<TabsTriggerProps>);
			}
			return child;
		})}
	</div>
);

const TabsList = ({ children, className = '', activeTab, onTabChange }: TabsListProps) => (
	<div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600 ${className}`}>
		{React.Children.map(children, (child) => {
			if (React.isValidElement(child)) {
				const childElement = child as React.ReactElement<{ value?: string }>;
				return React.cloneElement(childElement, {
					activeTab,
					onTabChange,
					isActive: activeTab === childElement.props.value,
				} as Partial<TabsTriggerProps>);
			}
			return child;
		})}
	</div>
);

const TabsTrigger = ({
	value,
	children,
	className = '',
	onTabChange,
	isActive,
}: TabsTriggerProps) => (
	<button
		className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
			isActive ? 'bg-white text-gray-900 shadow-sm' : 'hover:bg-white/50 hover:text-gray-900'
		} ${className}`}
		onClick={() => onTabChange && onTabChange(value)}
	>
		{children}
	</button>
);

const TabsContent = ({
	value,
	children,
	activeTab,
	className = '',
}: TabsContentProps) => (
	<div
		className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
			activeTab === value ? 'block' : 'hidden'
		} ${className}`}
	>
		{children}
	</div>
);

// --- Main Component ---
const BannerPosterGenerator = () => {
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
	const canvasRef = useRef(null);

	const [formData, setFormData] = useState({
		businessName: '',
		tagline: '',
		keyMessage: '',
		eventDetails: '',
		callToAction: '',
		brandColors: '',
		industry: '',
		style: '',
	});

	const [selectedFormat, setSelectedFormat] = useState(formats[0]);
	const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);
	const [selectedTextStyle, setSelectedTextStyle] = useState(textStyles[0]);
	const [customDimensions, setCustomDimensions] = useState({ width: '', height: '' });

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const downloadImage = (imageUrl: string) => {
		const link = document.createElement('a');
		link.download = `banner-${selectedFormat.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
		link.href = imageUrl;
		link.click();
	};

	const generateBanner = async () => {
		setIsGenerating(true);
		setGeneratedImages([]);
		try {
			const response = await fetch('/api/generate-banner', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					format: selectedFormat,
					theme: selectedTheme,
					textStyle: selectedTextStyle,
					customDimensions,
				}),
			});
			if (!response.ok) throw new Error('Failed to generate banner');
			const data = await response.json();
			setGeneratedImages([{ url: data.imageUrl, id: Date.now().toString() }]);
		} catch (err) {
			alert('Failed to generate banner. Please try again.');
			console.error(err);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-6xl mx-auto">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Banner & Poster Generator</h1>
					<p className="text-gray-600">Create professional banners and posters for your business</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Left Panel - Controls */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Create Your Banner</CardTitle>
							</CardHeader>
							<CardContent>
								<Tabs value="content" onValueChange={() => {}}>
									<TabsList
										className="grid w-full grid-cols-4"
										activeTab="content"
										onTabChange={() => {}}
									>
										<TabsTrigger value="content" activeTab="content" onTabChange={() => {}} isActive>
											<Type className="w-4 h-4 mr-2" />
											Content
										</TabsTrigger>
										<TabsTrigger value="format" activeTab="content" onTabChange={() => {}} isActive>
											<Layout className="w-4 h-4 mr-2" />
											Format
										</TabsTrigger>
										<TabsTrigger value="design" activeTab="content" onTabChange={() => {}} isActive>
											<Palette className="w-4 h-4 mr-2" />
											Design
										</TabsTrigger>
										<TabsTrigger value="export" activeTab="content" onTabChange={() => {}} isActive>
											<Download className="w-4 h-4 mr-2" />
											Export
										</TabsTrigger>
									</TabsList>

									<TabsContent value="content" activeTab="content">
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Business Name
												</label>
												<input
													type="text"
													className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													placeholder="Enter your business name"
													value={formData.businessName}
													onChange={(e) => handleInputChange('businessName', e.target.value)}
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Tagline
												</label>
												<input
													type="text"
													className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													placeholder="Your catchy tagline"
													value={formData.tagline}
													onChange={(e) => handleInputChange('tagline', e.target.value)}
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Key Message
												</label>
												<textarea
													className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													rows={3} // <-- fix: use a number, not a string
													placeholder="Main message you want to convey"
													value={formData.keyMessage}
													onChange={(e) => handleInputChange('keyMessage', e.target.value)}
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Call to Action
												</label>
												<input
													type="text"
													className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													placeholder="e.g., 'Visit our website', 'Call now!'"
													value={formData.callToAction}
													onChange={(e) => handleInputChange('callToAction', e.target.value)}
												/>
											</div>
										</div>
									</TabsContent>

									<TabsContent value="format" activeTab="content">
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Choose Format
												</label>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
													{formats.map((format) => (
														<button
															key={format.name}
															onClick={() => setSelectedFormat(format)}
															className={`p-3 text-left border rounded-md transition-colors ${
																selectedFormat.name === format.name
																	? 'border-blue-500 bg-blue-50'
																	: 'border-gray-300 hover:border-gray-400'
															}`}
														>
															<div className="font-medium">{format.name}</div>
															<div className="text-sm text-gray-500">
																{format.width} × {format.height}
															</div>
															<div className="text-xs text-gray-400">{format.category}</div>
														</button>
													))}
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Custom Dimensions
												</label>
												<div className="grid grid-cols-2 gap-3">
													<input
														type="number"
														className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														placeholder="Width"
														value={customDimensions.width}
														onChange={(e) => setCustomDimensions((prev) => ({ ...prev, width: e.target.value }))}
													/>
													<input
														type="number"
														className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														placeholder="Height"
														value={customDimensions.height}
														onChange={(e) => setCustomDimensions((prev) => ({ ...prev, height: e.target.value }))}
													/>
												</div>
											</div>
										</div>
									</TabsContent>

									<TabsContent value="design" activeTab="content">
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Color Theme
												</label>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
													{colorThemes.map((theme) => (
														<button
															key={theme.name}
															onClick={() => setSelectedTheme(theme)}
															className={`p-3 text-left border rounded-md transition-colors ${
																selectedTheme.name === theme.name
																	? 'border-blue-500 bg-blue-50'
																	: 'border-gray-300 hover:border-gray-400'
															}`}
														>
															<div className="font-medium">{theme.name}</div>
															<div className="flex space-x-2 mt-2">
																<div
																	className="w-6 h-6 rounded-full border border-gray-300"
																	style={{ backgroundColor: theme.primary }}
																/>
																<div
																	className="w-6 h-6 rounded-full border border-gray-300"
																	style={{ backgroundColor: theme.secondary }}
																/>
																<div
																	className="w-6 h-6 rounded-full border border-gray-300"
																	style={{ backgroundColor: theme.accent }}
																/>
															</div>
														</button>
													))}
												</div>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Text Style
												</label>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
													{textStyles.map((style) => (
														<button
															key={style.name}
															onClick={() => setSelectedTextStyle(style)}
															className={`p-3 text-left border rounded-md transition-colors ${
																selectedTextStyle.name === style.name
																	? 'border-blue-500 bg-blue-50'
																	: 'border-gray-300 hover:border-gray-400'
															}`}
														>
															<div className="font-medium">{style.name}</div>
														</button>
													))}
												</div>
											</div>
										</div>
									</TabsContent>

									<TabsContent value="export" activeTab="content">
										<div className="space-y-4">
											<Button
												onClick={generateBanner}
												disabled={isGenerating}
												className="w-full"
												size="lg"
											>
												{isGenerating ? (
													<>
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
														Generating...
													</>
												) : (
													<>
														<RefreshCw className="w-4 h-4 mr-2" />
														Generate Banner
													</>
												)}
											</Button>

											{generatedImages.length > 0 && (
												<div className="space-y-3">
													<h4 className="font-medium">Generated Images</h4>
													{generatedImages.map((image) => (
														<div key={image.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
															<span className="text-sm text-gray-600">
																{selectedFormat.name} - {selectedFormat.width}×{selectedFormat.height}
															</span>
															<div className="flex space-x-2">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => downloadImage(image.url)}
																>
																	<Download className="w-4 h-4 mr-1" />
																	Download
																</Button>
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					</div>

					{/* Right Panel - Preview */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Preview</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="bg-gray-100 rounded-lg p-4 min-h-96 flex items-center justify-center">
									{generatedImages.length > 0 ? (
										<div className="w-full">
											<Image
												src={generatedImages[0].url}
												alt="Generated banner"
												className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
												width={1920}
												height={1080}
											/>
										</div>
									) : (
										<div className="text-center">
											<Layout className="w-16 h-16 mx-auto text-gray-400 mb-4" />
											<p className="text-gray-500">
												Fill in your content and click &quot;Generate&quot; to see your preview
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Current Settings</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-600">Format:</span>
										<span className="font-medium">{selectedFormat.name}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Dimensions:</span>
										<span className="font-medium">
											{selectedFormat.width} × {selectedFormat.height}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Theme:</span>
										<span className="font-medium">{selectedTheme.name}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Text Style:</span>
										<span className="font-medium">{selectedTextStyle.name}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Hidden canvas for image generation */}
			<canvas ref={canvasRef} style={{ display: 'none' }} />
		</div>
	);
};

export default BannerPosterGenerator;