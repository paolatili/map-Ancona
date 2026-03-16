export default function handler(req, res) {
  const key = process.env.GMAPS_API_KEY;
  res.status(200).send(`window.GMAPS_API_KEY="${key}";`);
}