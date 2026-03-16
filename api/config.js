export default function handler(req, res) {
  const key = process.env.GMAPS_API_KEY;

  res.setHeader("Content-Type", "application/javascript");
  res.status(200).send(`window.GMAPS_API_KEY="${key}";`);
}