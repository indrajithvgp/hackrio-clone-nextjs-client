import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
// import {API} from '../index'
import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";
import { withRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";

const API = "https://hackrio-server.herokuapp.com/api";
const Links = ({
  query,
  data,
  category,
  links,
  totalLinks,
  linkSkip,
  linksLimit,
}) => {
  const API = "https://hackrio-server.herokuapp.com/api";

  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linkSkip);
  const [size, setSize] = useState(totalLinks);
  const [popular, setPopular] = useState([]);
  const head = () => (
    <Head>
      <title>{category.name} | Hackr.io - REV </title>
      <meta name="description" content={category.content.substring(0, 250)} />
      <meta property="og:image:secure_url" content={category.image.url} />
      <meta property="og:title" content={category.name} />
    </Head>
  );
  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    if (API) {
      const response = await axios.get(`${API}/link/popular/${category.slug}`);
      setPopular(response.data);
    }
  };

  const handleClickLink = async (id) => {
    const response = await axios.put(`${API}/click-count`, { linkId: id });
    loadPopular();
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
  };

  const listOfPopularLinks = () =>
    popular.map((l, i) => (
      <div className="row alert alert-secondary pt-2">
        <div className="col-md-8" onClick={() => handleClickLink(l._id)}>
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

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);
    setAllLinks(response.data.data);
  };

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2">
        <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
          <br />
          <span className="badge text-secondary pull-right">
            {l.clicks} Clicks
          </span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type}/ {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span className="badge text-success">{c.name}</span>
          ))}
        </div>
      </div>
    ));
  const LoadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip: toSkip,
      limit,
    });
    setAllLinks([...allLinks, ...response.data.links]);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };

  // const loadMoreButton = () => {
  //     return (
  //         size > 0 && size >= limit && (
  //             <button className="btn btn-outline-warning btn-lg">
  //                 Load More
  //             </button>
  //         )
  //     )
  // }

  return (
    <>
      {head()}
      <Layout>
        <div className="row">
          <div className="col-md-8">
            <h1 className="display-4 font-weight-bold">{category.name}</h1>
            <div className="lead alert alert-secondary pt-4">
              {renderHTML(category.content || "")}
            </div>
          </div>
          <div className="col-md-4">
            <img
              src={category.image.url}
              alt={category.name}
              style={{ width: "auto", maxHeight: "200px" }}
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-8">{listOfLinks()}</div>
          <div className="col-md-4">
            <h2 className="lead">Most Popular in {category.name}</h2>
            <div className="p-3">{listOfPopularLinks()}</div>
          </div>
        </div>
        {/* <div className="text-center pt-4 pb-5">{loadMoreButton()}</div> */}
        <div className="row">
          <div className="col-md-12 text-center">
            {/* <InfiniteScroll
                    pageStart={0}
                    loadMore={LoadMore}
                    hasMore={size> 0 && size >= limit}
                    loader={<div className="loader" key={0}>Loading ...</div>}
                >
                    
                </InfiniteScroll> */}
          </div>
        </div>
      </Layout>
    </>
  );
};

Links.getInitialProps = async ({ query }) => {
  let skip = 0;
  let limit = 1;
  const API = "https://hackrio-server.herokuapp.com/api";
  const response = await axios.post(`${API}/category/${query.slug}`, {
    skip,
    limit,
  });
  return {
    query,
    category: response.data.category,
    links: response.data.data,
    totalLinks: response.data.data.length,
    linksLimit: limit,
    linkSkip: skip,
  };
};
// export async function getServerSideProps({ req, res, params }) {
//   let skip = 0;
//   let limit = 1;
//   const API = "https://hackrio-server.herokuapp.com/api";
//   const response = await axios.post(`${API}/category/${params.slug}`, {
//     skip,
//     limit,
//   });
//   return {
//     props: {
//       params,
//       category: response.data.category,
//       links: response.data.data,
//       totalLinks: response.data.data.length,
//       linksLimit: limit,
//       linkSkip: skip,
//     },
//   };
// }

export default Links;
