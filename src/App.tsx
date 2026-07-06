import React, { useState, useEffect } from 'react';
import { MODEL_SCHEMAS } from './data/models';
import { ModelSchema, RunLogEntry } from './types';
import { Navbar } from './components/Navbar';
import { ModelHero } from './components/ModelHero';
import { SectionTabs } from './components/SectionTabs';
import { PricingPanel, HistoryPanel, FAQsPanel, SimilarModelsPanel } from './components/SecondaryPanels';
import { DynamicForm } from './components/DynamicForm';
import { CodeViewer } from './components/CodeViewer';
import { OutputPanel } from './components/OutputPanel';
import { SchemaEditorModal } from './components/SchemaEditorModal';
import { AdminConsole } from './components/AdminConsole';
import { ApiTokenSelector } from './components/ApiTokenSelector';
import { ChatPlayground } from './components/ChatPlayground';
import { ApiDocsPanel } from './components/ApiDocsPanel';

export default function App() {
  const [currentView, setCurrentView] = useState<'playground' | 'console'>('playground');
  const [models, setModels] = useState<ModelSchema[]>(MODEL_SCHEMAS);
  const [currentModel, setCurrentModel] = useState<ModelSchema>(models[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSection, setActiveSection] = useState<string>('Playground');
  
  // Initialize form data from currentModel defaults
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    Object.keys(currentModel.properties).forEach((k) => {
      initial[k] = currentModel.properties[k].default ?? '';
    });
    return initial;
  });

  const [activeTab, setActiveTab] = useState<string>('Form');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [logs, setLogs] = useState<RunLogEntry[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(115);
  const [outputUrl, setOutputUrl] = useState<string | undefined>(currentModel.sampleVideoUrl || currentModel.sampleImageUrl);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState<boolean>(false);

  // When model changes, reset form data and output preview
  const handleSelectModel = (model: ModelSchema) => {
    setCurrentModel(model);
    const initial: Record<string, any> = {};
    Object.keys(model.properties).forEach((k) => {
      initial[k] = model.properties[k].default ?? '';
    });
    setFormData(initial);
    setOutputUrl(model.sampleVideoUrl || model.sampleImageUrl);
    setLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        message: `Model switched to ${model.id}`,
        type: 'info'
      }
    ]);
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleResetForm = () => {
    const initial: Record<string, any> = {};
    Object.keys(currentModel.properties).forEach((k) => {
      initial[k] = currentModel.properties[k].default ?? '';
    });
    setFormData(initial);
  };

  // Simulation timer and logs runner
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating) {
      setElapsedSeconds(0);
      setOutputUrl(undefined);
      
      const startTime = Date.now();
      setLogs([
        {
          timestamp: new Date().toLocaleTimeString(),
          message: `Allocating container node for ${currentModel.id}...`,
          type: 'info'
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          message: `Using seed: ${formData.seed || Math.floor(Math.random() * 999999)}`,
          type: 'info'
        }
      ]);

      timer = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1;
          
          if (next === 2) {
            setLogs(l => [...l, {
              timestamp: new Date().toLocaleTimeString(),
              message: currentModel.category === 'Language Model' ? 'Parsing user instructions & initializing 256K context tree...' : 'Loading checkpoint weights into VRAM...',
              type: 'step'
            }]);
          } else if (next === 4) {
            setLogs(l => [...l, {
              timestamp: new Date().toLocaleTimeString(),
              message: currentModel.category === 'Language Model' ? `Executing CoT reasoning (effort: ${formData.reasoning_effort || 'medium'}) & real-time Web Search grounding...` : `Executing diffusion sampling steps (inference steps: ${formData.num_inference_steps || 30})...`,
              type: 'step'
            }]);
          } else if (next === 7) {
            setLogs(l => [...l, {
              timestamp: new Date().toLocaleTimeString(),
              message: currentModel.category === 'Language Model' ? 'Synthesizing structured completion & verifying response format...' : 'Applying audio-visual spatial synchronization...',
              type: 'step'
            }]);
          } else if (next === 9) {
            setIsGenerating(false);
            setOutputUrl(currentModel.sampleVideoUrl || currentModel.sampleImageUrl || (currentModel.category === 'Language Model' ? '' : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=80'));
            setLogs(l => [
              ...l,
              {
                timestamp: new Date().toLocaleTimeString(),
                message: currentModel.category === 'Language Model' ? `Language completion generated successfully in ${((Date.now() - startTime) / 1000).toFixed(1)}sec` : `Generated artifact successfully in ${((Date.now() - startTime) / 1000).toFixed(1)}sec`,
                type: 'success'
              },
              {
                timestamp: new Date().toLocaleTimeString(),
                message: currentModel.category === 'Language Model' ? 'Response tokens streamed to client viewport (Speed: 164 tok/s).' : 'Downloading artifact payload (2.56MB) to client viewport.',
                type: 'info'
              }
            ]);
            clearInterval(timer);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGenerating, currentModel, formData]);

  const handleApplyCustomSchema = (updated: ModelSchema) => {
    setModels(prev => prev.map(m => m.id === updated.id ? updated : m));
    handleSelectModel(updated);
  };

  if (currentView === 'console') {
    return (
      <AdminConsole
        models={models}
        onUpdateModel={handleApplyCustomSchema}
        onExitConsole={() => setCurrentView('playground')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans selection:bg-purple-600 selection:text-white pb-20">
      {/* Brand Navigation */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenSchemaEditor={() => setIsSchemaModalOpen(true)}
        onEnterConsole={() => setCurrentView('console')}
      />

      {/* Hero Banner matching prototype 1 & 2 */}
      <ModelHero
        currentModel={currentModel}
        models={models}
        onSelectModel={handleSelectModel}
        onNavigateSection={setActiveSection}
      />

      {/* Section Anchor Tabs matching prototype 2 & 3 */}
      <SectionTabs
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      {/* Main Content Sections */}
      <main className="max-w-[1400px] mx-auto px-6 py-10">
        {activeSection === 'Playground' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: API Token Card + Form/JSON Mode Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Independent API Token Card */}
              <ApiTokenSelector />

              {/* Form / JSON Mode Card */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
                {/* Form Mode / JSON Mode pill switch matching prototype 2 */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6 w-fit">
                  {['Form', 'JSON'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                        activeTab === tab
                          ? 'bg-white text-gray-900 shadow-2xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {tab === 'Form' ? 'Form Mode' : tab === 'JSON' ? 'JSON Mode' : tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'Form' ? (
                  <DynamicForm
                    modelId={currentModel.id}
                    properties={currentModel.properties}
                    formData={formData}
                    onChange={handleInputChange}
                    onRun={() => setIsGenerating(true)}
                    onReset={handleResetForm}
                    isGenerating={isGenerating}
                    isChatModel={currentModel.category === 'Language Model'}
                  />
                ) : (
                  <CodeViewer
                    modelId={currentModel.id}
                    formData={formData}
                    activeTab={activeTab}
                  />
                )}
              </div>
            </div>

            {/* Right Column Card: Chat Dialog or Model Preview Area */}
            <div className="lg:col-span-7 flex flex-col">
              {currentModel.category === 'Language Model' ? (
                <ChatPlayground
                  currentModel={currentModel}
                  formData={formData}
                  onReset={handleResetForm}
                />
              ) : (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col min-h-[640px]">
                  <div className="flex-1 flex flex-col">
                    <OutputPanel
                      model={currentModel}
                      isGenerating={isGenerating}
                      logs={logs}
                      elapsedSeconds={elapsedSeconds}
                      outputUrl={outputUrl}
                      outputType={currentModel.category === 'Video Generation' ? 'video' : 'image'}
                      onTweak={() => setActiveTab('Form')}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'API' && (
          <ApiDocsPanel
            currentModel={currentModel}
            formData={formData}
            onBackToPlayground={() => setActiveSection('Playground')}
          />
        )}

        {activeSection === 'History' && (
          <HistoryPanel
            currentModel={currentModel}
            models={models}
            onSelectModel={handleSelectModel}
            onBackToPlayground={() => setActiveSection('Playground')}
          />
        )}

        {activeSection === 'Pricing' && (
          <PricingPanel
            currentModel={currentModel}
            models={models}
            onSelectModel={handleSelectModel}
            onBackToPlayground={() => setActiveSection('Playground')}
          />
        )}

        {activeSection === 'FAQs' && <FAQsPanel />}

        {activeSection === 'Similar Models' && (
          <SimilarModelsPanel
            currentModel={currentModel}
            models={models}
            onSelectModel={handleSelectModel}
            onBackToPlayground={() => setActiveSection('Playground')}
          />
        )}
      </main>

      <SchemaEditorModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        currentModel={currentModel}
        onApplySchema={handleApplyCustomSchema}
      />
    </div>
  );
}

