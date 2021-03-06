import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
// import {API} from '../config'
import Link from "next/link";
import moment from "moment";

const API = "https://hackrio-server.herokuapp.com/api";
const Home = ({ categories }) => {
  const [popular, setPopular] = useState([]);
  const API = "https://hackrio-server.herokuapp.com/api";

  useEffect(() => {
    console.log("works..");
    loadPopular();
  }, []);

  const loadPopular = async () => {
    if (API) {
      const response = await axios.get(`${API}/link/popular`);
      setPopular(response.data);
    }
  };

  const handleClick = async (id) => {
    const response = await axios.put(`${API}/click-count`, {
      linkId: id,
    });
    loadPopular();
  };
  const listOfLinks = () =>
    popular.map((l, i) => (
      <div className="row alert alert-secondary pt-2">
        <div className="col-md-8" onClick={() => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>

        <div className="col-md-4 pt-2">
          <span className="pull-right">{moment(l.createdAt).fromNow()}</span>
        </div>

        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span key={i} className="badge text-success">
              {c.name}
            </span>
          ))}
          <span key={i} className="badge text-secondary pull-right">
            {l.clicks} clicks
          </span>
        </div>
      </div>
    ));
  const listCategories = () => {
    // console.log(popular)
    return categories.map((category, i) => (
      <Link key={i} href={`/links/${category.slug}`}>
        <a
          style={{ border: "1px solid red" }}
          className="bg-light p-3 col-md-4"
        >
          <div>
            <div className="row">
              <div className="col-md-4">
                <img
                  style={{ width: "50px", height: "auto" }}
                  className="pr-3"
                  src={category.image && category.image.url}
                  alt={category.name}
                />
              </div>
              <div className="col-md-8">{category.name}</div>
            </div>
          </div>
        </a>
      </Link>
    ));
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="font-weight-bold">Browse Tutorials/ Courses</h1>
        </div>
        <div className="row">{listCategories()}</div>
      </div>
      <div className="row pt-5">
        <h2 className="font-weight-bold pb-3">Trending</h2>
        {popular.length > 0 && listOfLinks()}
      </div>
    </Layout>
  );
};

// export async function getServerSideProps() {
//   const API = "https://hackrio-server.herokuapp.com/api";
//     const response = await axios.get(
//       `${API}/categories`
//     );
//     // const categories = await response.data;
//   return {
//     props: {
//       categories: response.data,
//     },
//   };
// }
Home.getInitialProps = async() => {
  console.log("hola from home")
  const API = "https://hackrio-server.herokuapp.com/api";
   console.log(API);
  const response = await axios.get(`${API}/categories`);
  // const categories = await response.data;
  return {
    categories: response.data,
  };
};

export default Home;
