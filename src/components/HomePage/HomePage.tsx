import { useEffect } from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { setTitle } from "../Utils/setTitle";

function HomePage() {
  useEffect(() => {
    setTitle("");
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>Monity</span>
      <span>TODO: Make the HomePage</span>
      <div style={{ width: "300px" }}>
        <Link to="/login">
          <Button variant="contained" color="primary">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
