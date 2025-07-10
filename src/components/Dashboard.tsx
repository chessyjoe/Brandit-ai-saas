import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Download,
  TrendingUp,
  FileText, 
  Palette, 
  Bell, 
  User, 
  Settings, 
  CreditCard, 
  LogOut,
  Image as ImageIcon // Use this for icon, not for images
} from 'lucide-react';
import Image from 'next/image';

type Project = {
  id: string;
  name: string;
  industry: string;
  status: string;
  assets: number;
  createdAt: string;
  thumbnail: string;
};

const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const stats = [
    { label: 'Total Projects', value: '12', change: '+2 this week', icon: FileText, color: 'bg-blue-500' },
    { label: 'Assets Created', value: '147', change: '+23 this week', icon: ImageIcon, color: 'bg-green-500' },
    { label: 'Downloads', value: '89', change: '+12 this week', icon: Download, color: 'bg-purple-500' },
    { label: 'Usage This Month', value: '78%', change: '22% remaining', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' || project.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Palette className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">BrandAI</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Image
                    src="/images/default-avatar.png"
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">John Doe</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </button>
                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </button>
                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Billing
                      </button>
                      <hr className="my-2" />
                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Manage your brand projects and create amazing assets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects & Sidebar */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Projects */}
          <div className="lg:col-span-2">
            {/* Projects header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </button>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Projects content */}
              <div className="p-6">
                {loadingProjects ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Loading projects...</p>
                  </div>
                ) : (
                  <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {filteredProjects.length === 0 ? (
                      <div className="col-span-full text-center py-4">
                        <p className="text-gray-500">No projects found.</p>
                      </div>
                    ) : (
                      filteredProjects.map(project => (
                        <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                          <div className="relative">
                            <Image
                              src={project.thumbnail}
                              alt={project.name}
                              width={400}
                              height={250}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black opacity-10"></div>
                          </div>

                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
                            <p className="text-sm text-gray-500">{project.industry}</p>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs font-medium rounded-full px-3 py-1 ${getStatusColor(project.status)}`}>
                                  {project.status}
                                </span>
                              </div>

                              <div className="text-xs text-gray-500">
                                <p>Assets: {project.assets}</p>
                                <p>Created: {formatDate(project.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            {/* Quick Actions */}
            {/* These parts are also fully complete in your original code */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
