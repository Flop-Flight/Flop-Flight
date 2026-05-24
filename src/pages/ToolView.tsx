import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Construction } from "lucide-react";
import { toolsConfig } from "../config/toolsConfig";
import { IconResolver } from "../components/IconResolver";
import { WordCounter } from "../tools/WordCounter";
import { QrGenerator } from "../tools/QrGenerator";
import { PasswordGenerator } from "../tools/PasswordGenerator";
import { JsonFormatter } from "../tools/JsonFormatter";
import { GstCalculator } from "../tools/GstCalculator";
import { UnitConverter } from "../tools/UnitConverter";
import { Base64Tool } from "../tools/Base64Tool";
import { ColorPicker } from "../tools/ColorPicker";
import { StopWatch } from "../tools/StopWatch";
import { PomodoroTimer } from "../tools/PomodoroTimer";
import { CaseConverter } from "../tools/CaseConverter";
import { AgeCalculator } from "../tools/AgeCalculator";
import { LoanEmiCalculator } from "../tools/LoanEmiCalculator";
import { PercentageCalculator } from "../tools/PercentageCalculator";
import { RandomNamePicker } from "../tools/RandomNamePicker";
import { TypingTest } from "../tools/TypingTest";
import { ResumeBuilder } from "../tools/ResumeBuilder";
import { CaptionGenerator } from "../tools/CaptionGenerator";
import { Metronome } from "../tools/Metronome";
import { PrivacyPolicyGen } from "../tools/PrivacyPolicyGen";
import { BioGenerator } from "../tools/BioGenerator";
import { CurrencyConverter } from "../tools/CurrencyConverter";
import { HtmlPreview } from "../tools/HtmlPreview";
import { BgRemover } from "../tools/BgRemover";
import { ImageResizer } from "../tools/ImageResizer";
import { RandomNumberGenerator } from "../tools/RandomNumberGenerator";
import { PlanetDistance } from "../tools/PlanetDistance";
import { CountryDistance } from "../tools/CountryDistance";
import { LanguageTranslator } from "../tools/LanguageTranslator";
import { LuminixAI } from "../tools/LuminixAI";
import { PeriodicTable } from "../tools/PeriodicTable";
import { PhysicsLab } from "../tools/PhysicsLab";
import { BiologyLab } from "../tools/BiologyLab";

export const ToolView = () => {
  const { id } = useParams<{ id: string }>();
  const tool = toolsConfig.find((t) => t.id === id);

  if (!tool) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Tool Not Found</h2>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const renderToolComponent = () => {
    switch (id) {
      case "word-counter":
        return <WordCounter />;
      case "qr-generator":
        return <QrGenerator />;
      case "password-gen":
        return <PasswordGenerator />;
      case "json-formatter":
        return <JsonFormatter />;
      case "gst-calc":
        return <GstCalculator />;
      case "unit-converter":
        return <UnitConverter />;
      case "base64-encoder":
        return <Base64Tool />;
      case "color-picker":
        return <ColorPicker />;
      case "stop-watch":
        return <StopWatch />;
      case "pomodoro-timer":
        return <PomodoroTimer />;
      case "case-converter":
        return <CaseConverter />;
      case "age-calc":
        return <AgeCalculator />;
      case "loan-emi-calc":
        return <LoanEmiCalculator />;
      case "percentage-calc":
        return <PercentageCalculator />;
      case "random-name-picker":
        return <RandomNamePicker />;
      case "typing-test":
        return <TypingTest />;
      case "resume-builder":
        return <ResumeBuilder />;
      case "caption-gen":
        return <CaptionGenerator />;
      case "metronome":
        return <Metronome />;
      case "privacy-policy-gen":
        return <PrivacyPolicyGen />;
      case "bio-generator":
        return <BioGenerator />;
      case "currency-converter":
        return <CurrencyConverter />;
      case "html-preview":
        return <HtmlPreview />;
      case "bg-remover":
        return <BgRemover />;
      case "image-resizer":
        return <ImageResizer />;
      case "random-number":
        return <RandomNumberGenerator />;
      case "planet-distance":
        return <PlanetDistance />;
      case "country-distance":
        return <CountryDistance />;
      case "language-translator":
        return <LanguageTranslator />;
      case "scholar-ai":
        return <LuminixAI />;
      case "periodic-table":
        return <PeriodicTable />;
      case "physics-lab":
        return <PhysicsLab />;
      case "biology-lab":
        return <BiologyLab />;
      default:
        return <p>Tool component not linked correctly.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Library</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/40 ring-1 ring-slate-200"
        >
          {/* Header */}
          <div className="border-b border-slate-100 bg-slate-50/50 p-8">
            <div className="flex items-center space-x-4">
               <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                 <IconResolver name={tool.iconName} className="h-8 w-8" />
               </div>
               <div>
                 <h1 className="text-3xl font-bold text-slate-900">{tool.name}</h1>
                 <p className="mt-1 text-slate-500">{tool.description}</p>
               </div>
            </div>
            <div className="mt-6 flex items-center space-x-3">
               <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                 {tool.category}
               </span>
               {tool.isPlaceholder && (
                 <span className="flex items-center space-x-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Construction className="h-3 w-3" />
                    <span>In Development</span>
                 </span>
               )}
            </div>
          </div>

          {/* Interface area */}
          <div className="p-8">
            {tool.isPlaceholder ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-20 text-center">
                <Construction className="h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-medium text-slate-900">Under Construction</h3>
                <p className="mt-2 max-w-md text-sm text-slate-500">
                  We are currently building the {tool.name}. Check back soon for updates!
                </p>
                <div className="mt-8 flex space-x-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
                </div>
              </div>
            ) : (
              <div className="min-h-[400px]">
                {renderToolComponent()}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

