import { useNavigate } from 'react-router-dom'

interface HeroProps {
  image: string
  title: string
  subtitle: string
  buttonText?: string
  buttonLink?: string
  onClick?: () => void
}

const Hero: React.FC<HeroProps> = ({ image, title, subtitle, buttonText, buttonLink }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (buttonLink) navigate(buttonLink)
  }

  return (
    <div
      className="relative h-[60vh] min-w-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-opacity-50" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-lg mb-4">{subtitle}</p>
        {buttonText && buttonLink && (
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  )
}

export default Hero
