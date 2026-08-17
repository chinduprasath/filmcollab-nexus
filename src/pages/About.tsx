import { LandingTopbar } from "@/components/layout/landing-topbar";
import { LandingFooter } from "@/components/layout/landing-footer";
import { Film, Users, Globe, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans overflow-x-hidden pt-16">
      <LandingTopbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden bg-yellow-50">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-yellow-600">FilmCollab</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to democratize filmmaking by connecting passionate creators across the globe.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                Founded by filmmakers for filmmakers, FilmCollab was born out of the frustration of scattered networks and fragmented production tools. We realized that the hardest part of making a film shouldn't be finding the right people to make it with.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Today, we provide a unified platform where talent meets opportunity, where projects are managed seamlessly, and where the next generation of cinema comes to life.
              </p>
            </div>
            <div className="bg-gray-100 rounded-3xl p-8 relative overflow-hidden h-[400px] flex items-center justify-center border border-gray-200">
              <Film className="w-32 h-32 text-gray-300 absolute" />
              <div className="relative z-10 text-center">
                <p className="text-2xl font-semibold text-gray-800 italic">"Empowering creators to tell stories that matter."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community First</h3>
              <p className="text-gray-600">
                We believe in the power of collaboration. Every feature we build is designed to strengthen connections between creators.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600">
                Talent knows no borders. We provide a platform that breaks down geographical barriers in the film industry.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We continuously evolve our tools to meet the modern demands of production, casting, and project management.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
