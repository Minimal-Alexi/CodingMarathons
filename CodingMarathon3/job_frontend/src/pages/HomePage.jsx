import JobListings from "../components/JobListings";

const Home = ({isAuthenticated}) => {
  return (
    <div className="home">
      <JobListings  isAuthenticated={isAuthenticated}/>
    </div>
  );
};

export default Home;
