const cookieName = "ab-test-cookie";
const newHomepagePathName = "/test-b";

const abTest = async (context) => {
  const url = new URL(context.request.url);
  // if homepage
  if (url.pathname === "/") {
    // if cookie ab-test-cookie=new then change the request to go to /test
    // if no cookie set, pass x% of traffic and set a cookie value to "current" or "new"

    let cookie = request.headers.get("cookie");
    // is cookie set?
    if (cookie && cookie.includes(`${cookieName}=new`)) {
      // pass the request to /test
      url.pathname = newHomepagePathName;
      return context.env.ASSETS.fetch(url);
    } else {
      const percentage = Math.floor(Math.random() * 100);
      let version = "current"; // default version
      // change pathname and version name for 50% of traffic
      if (percentage < 50) {
        url.pathname = newHomepagePathName;
        version = "new";
      }
      // get the static file from ASSETS, and attach a cookie
      const asset = await context.env.ASSETS.fetch(url);
      let response = new Response(asset.body, asset);
      response.headers.append("Set-Cookie", `${cookieName}=${version}; path=/`);
      return response;
    }
  }
  return context.next();
};

export const onRequest = [abTest];