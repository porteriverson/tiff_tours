interface YouTubeEmbedProps {
  embedId: string
  title?: string
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ embedId, title = 'YouTube video player' }) => {
  return (
    <div className="w-full">
      <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-xl">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${embedId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default YouTubeEmbed
