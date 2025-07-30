import "./shimmerCard.css";

const ShimmerCard = () => {
  return (
    <div className="movie-card shimmer-card">
      <div className="shimmer-poster" />
      <div className="shimmer-info">
        <div className="shimmer-title" />
        <div className="shimmer-rating" />
      </div>
    </div>
  );
};

export default ShimmerCard;
