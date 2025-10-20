import { Plane, BookOpen, Users, Heart, Globe, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AboutContent = () => {
  const navigate = useNavigate()
  const handleJoinAdventure = () => {
    navigate('/tours')
  }

  return (
    <div className="bg-gradient-to-b from-sky-50 via-white to-amber-50 min-h-screen min-w-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-amber-400/10 dark:from-sky-600/10 dark:to-amber-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-sky-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  30 Years of Adventure
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                Hi! I'm{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-amber-600 dark:from-sky-400 dark:to-amber-400">
                  Tiffany Shulz
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                I've got the best job in the world. Teaching AP European and World History for
                nearly three decades, I've discovered the perfect blend of my two greatest passions:{' '}
                <span className="font-semibold text-sky-700 dark:text-sky-400">history</span> and{' '}
                <span className="font-semibold text-amber-700 dark:text-amber-400">travel</span>.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-md">
                  <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    AP History Teacher
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-md">
                  <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Travel Expert
                  </span>
                </div>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://tpzsexyppmsowlsykfoz.supabase.co/storage/v1/object/public/tour-images/Tiffany_Helicopter.png"
                  alt="Tiffany Shulz at the Pyramids"
                  className="w-full h-full object-cover aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-rose-500 to-pink-500 text-white p-5 rounded-2xl shadow-xl animate-pulse">
                <Heart className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Origin Story Section */}
      <div className="bg-white dark:bg-slate-800 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://tpzsexyppmsowlsykfoz.supabase.co/storage/v1/object/public/tour-images/Jake_Tiffany_collosseum.JPG"
                  alt="European travel adventure at the Colosseum"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -top-6 -left-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white p-5 rounded-2xl shadow-xl">
                <Plane className="w-8 h-8" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-10 h-10 text-amber-500 dark:text-amber-400" />
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                  The Spark That Started It All
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  It all began with a study abroad program in college with my husband, followed by
                  an unforgettable backpacking journey across Europe after graduation.
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Those early adventures transformed my life completely. Over the years, I
                  discovered the perfect intersection where{' '}
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-amber-600 dark:from-sky-400 dark:to-amber-400">
                    history meets travel
                  </span>{' '}
                  — and that's where my true passion lives today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-600 to-amber-600"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            <Users className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl text-white font-bold mb-6">My Mission</h2>
            <p className="text-xl sm:text-2xl text-white leading-relaxed mb-6">
              I've had the incredible privilege of taking{' '}
              <span className="font-bold underline decoration-amber-400">
                hundreds of students and parents abroad
              </span>
              . There's nothing I enjoy more than sharing the treasures of travel and history.
            </p>
            <p className="text-lg sm:text-xl text-white/95">
              The best part? Watching those "aha!" moments when connections click and genuine
              passion for our amazing world ignites.
            </p>
          </div>
        </div>
      </div>

      {/* Tour Types Section */}
      <div className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Two Ways to Explore
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Choose your adventure</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Educational Adventures */}
            <div className="group bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-3 bg-gradient-to-r from-sky-500 to-blue-600"></div>
              <div className="p-8">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  Educational Adventures
                </h3>
                <p className="text-lg font-semibold text-sky-700 dark:text-sky-400 mb-4">
                  For students and community members
                </p>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  These tours are transformative experiences focused on{' '}
                  <span className="font-semibold text-sky-700 dark:text-sky-400">
                    personal growth
                  </span>
                  . Build social skills, forge deep connections to your studies, and participate in
                  an adventure that will{' '}
                  <span className="font-semibold">change your life forever</span>.
                </p>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://tpzsexyppmsowlsykfoz.supabase.co/storage/v1/object/public/tour-images/PantheonStudents.JPG"
                    alt="Students on educational tour at the Pantheon"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Leisurely Learning */}
            <div className="group bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-3 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <div className="p-8">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  Leisurely Learning Tours
                </h3>
                <p className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-4">
                  For adults and families
                </p>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Experience a more{' '}
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    relaxed pace
                  </span>{' '}
                  while still diving deep into history. These tours offer{' '}
                  <span className="font-semibold">easygoing yet enriching</span> learning
                  experiences perfect for families and adult travelers.
                </p>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://tpzsexyppmsowlsykfoz.supabase.co/storage/v1/object/public/tour-images/Macchu%20Picchu.JPG"
                    alt="Family tour at Machu Picchu"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Join Section */}
      <div className="bg-slate-100 dark:bg-slate-950 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Why Join Me?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Here's why these tours will seriously impact your life
            </p>
          </div>

          <div className="space-y-8">
            {/* Reason 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    The Past Comes Alive
                  </h3>
                  <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    As a history teacher at heart, we don't just look at old buildings — we{' '}
                    <span className="font-semibold text-purple-700 dark:text-purple-400">
                      connect the dots
                    </span>
                    . I'll help you understand the <span className="italic">why</span> and{' '}
                    <span className="italic">who</span> behind every landmark, transforming dry
                    facts into thrilling stories. You'll gain a profound, personal connection to the
                    world that no textbook can provide.
                  </p>
                </div>
              </div>
            </div>

            {/* Reason 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg">
                    <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Transform Your Worldview
                  </h3>
                  <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    Travel is the ultimate teacher. For students, these trips are powerful{' '}
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      confidence boosters and skill builders
                    </span>
                    . For everyone, my tours foster empathy and a broader perspective. You'll gain
                    fresh insights into different cultures and people —{' '}
                    <span className="font-semibold">the most valuable lesson anyone can learn</span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Plane className="w-16 h-16 text-white mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Make History?
          </h2>
          <p className="text-2xl sm:text-3xl text-white/95 mb-10">
            Let's create unforgettable memories together!
          </p>
          <button
            onClick={handleJoinAdventure}
            className="bg-white text-blue-600 px-8 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold hover:bg-slate-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 inline-flex items-center gap-3 group"
          >
            Join the Adventure
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutContent
