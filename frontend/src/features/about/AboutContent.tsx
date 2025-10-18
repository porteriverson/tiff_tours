import { Plane, BookOpen, Users, Heart, Globe, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AboutContent = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Intro Section with Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Hi! I'm Tiffany Shulz
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Honestly, I've got the best job in the world. I've been teaching history—specifically
              AP European and World History—for nearly{' '}
              <span className="font-semibold text-amber-600 dark:text-amber-400">30 years</span>{' '}
              now.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              My passion for what happened in the past is only matched by my absolute love for
              travel, a journey that really kicked off about three decades ago.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://tpzsexyppmsowlsykfoz.supabase.co/storage/v1/object/public/tour-images/TiffanyPyramids.jpeg"
                alt="Tiffany Shulz"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-amber-500 text-white p-4 rounded-xl shadow-lg">
              <Heart className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Origin Story Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://tpzsexyppmsowlsykfoz.supabase.co/storage/v1/object/public/tour-images/Jake_Tiffany_collosseum.JPG"
                  alt="European travel adventure"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -left-4 bg-blue-500 text-white p-4 rounded-xl shadow-lg">
                <Plane className="w-8 h-8" />
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-amber-500" />
                The Spark That Started It All
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                It happened when my husband and I did a study abroad program back in college, and
                then we solidified that love by backpacking all across Europe after we graduated.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Those early adventures totally changed my life, and over the years, my two greatest
                loves—
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {' '}
                  history and travel
                </span>
                —found this perfect spot to intersect, which is where my true passion lies today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-16 h-16 text-white mx-auto mb-6" />
          <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed">
            I've been incredibly lucky to take{' '}
            <span className="font-bold">hundreds of students and parents abroad</span>. Truly, there
            is nothing I enjoy more than sharing the treasure of travel and history with students
            and their families.
          </p>
          <p className="text-xl text-white/90 mt-6">
            The absolute best part? Helping others make those "aha!" connections and feel genuinely
            passionate about the amazing world we live in.
          </p>
        </div>
      </div>

      {/* Tour Types Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Two Amazing Ways to Explore
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Educational Adventures */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Educational Adventures
            </h4>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              For students and community members
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              These tours are all about <span className="font-semibold">growth</span>. You'll boost
              your social skills, make deep, tangible connections to what you're studying, and take
              part in an experience that, I promise, will{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                change your life forever
              </span>
              .
            </p>
            <div className="aspect-video rounded-xl overflow-hidden mt-6">
              <img
                src="https://tpzsexyppmsowlsykfoz.supabase.co/storage/v1/object/public/tour-images/PantheonStudents.JPG"
                alt="Students on educational tour"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Leisurely Learning */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Leisurely Learning Tours
            </h4>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              For adults and families
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              These are more relaxed, offering a <span className="font-semibold">gentler pace</span>{' '}
              while still diving deep into history. They're designed for{' '}
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                easygoing, yet enriching
              </span>
              , learning experiences.
            </p>
            <div className="aspect-video rounded-xl overflow-hidden mt-6">
              <img
                src="https://tpzsexyppmsowlsykfoz.supabase.co/storage/v1/object/public/tour-images/Macchu%20Picchu.JPG"
                alt="Family on leisurely tour"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Why Join Section */}
      <div className="bg-gray-100 dark:bg-gray-950 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Why You Should Join Me on a Tour!
          </h3>
          <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
            I'd absolutely love for you to join one of my tours! Here's why it'll seriously impact
            your life:
          </p>

          <div className="space-y-8">
            {/* Reason 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:flex items-start gap-8">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="bg-purple-500 w-20 h-20 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-grow">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  The Past Comes Alive (I mean, REALLY Alive)
                </h4>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Because I'm a history teacher at heart, we don't just look at old buildings; we
                  <span className="font-semibold"> connect the dots</span>. I help you understand
                  the
                  <span className="italic"> why</span> and the <span className="italic">who</span>{' '}
                  behind the landmarks, transforming dry facts into thrilling stories. You'll leave
                  with a profound, personal connection to the world that you just can't get from a
                  textbook or a typical vacation.
                </p>
              </div>
            </div>

            {/* Reason 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:flex items-start gap-8">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="bg-green-500 w-20 h-20 rounded-2xl flex items-center justify-center">
                  <Globe className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-grow">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  It Changes How You See the World (and Yourself)
                </h4>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Travel is the best teacher. For students, these trips are huge
                  <span className="font-semibold"> confidence boosters and skill builders</span>.
                  For everyone, my tours foster empathy and a broader worldview. You gain a fresh
                  perspective on different cultures and people, which is{' '}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    the most valuable lesson anyone can learn
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make History and Memories?
          </h3>
          <p className="text-2xl text-white/90 mb-8">Let's go!</p>
          <button
            onClick={() => {
              navigate('/tours')
            }}
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform"
          >
            Join the Adventure
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutContent
