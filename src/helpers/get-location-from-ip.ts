export const get_location_from_ip = async (ip: string) => {
  const location_api_url = process.env.LOC_API;

  try {
    const locationResponse = await fetch(
      `${location_api_url}/${ip}?fields=49158`
    );

    if (!locationResponse.ok) {
      throw new Error("Response Failed");
    }

    const data = await locationResponse.json();
    if (data.status === "success") {
      return { countryCode: data.countryCode, region: data.region };
    }
  } catch (err) {
    console.error(err);
  }
  return null;
};
