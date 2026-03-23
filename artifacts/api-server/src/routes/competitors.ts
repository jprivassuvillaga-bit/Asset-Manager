import { Router, type IRouter } from "express";
import {
  getAllOffers,
  filterOffers,
  computePriceComparison,
  getSwotAnalysis,
  getDashboardSummary,
  generateMapPoints,
} from "../data/competitorEngine.js";

const router: IRouter = Router();

router.get("/offers", (req, res) => {
  const { competitor, location, dateFrom, dateTo } = req.query;

  const allOffers = getAllOffers();
  let competitors: string[] = [];
  if (Array.isArray(competitor)) {
    competitors = competitor as string[];
  } else if (typeof competitor === "string" && competitor.length > 0) {
    competitors = competitor.split(",").map((c) => c.trim()).filter(Boolean);
  }

  const filtered = filterOffers(allOffers, {
    competitor: competitors,
    location: location as string | undefined,
    dateFrom: dateFrom as string | undefined,
    dateTo: dateTo as string | undefined,
  });

  res.json(filtered);
});

router.get("/price-comparison", (req, res) => {
  const { location } = req.query;

  const allOffers = getAllOffers();
  const filtered = filterOffers(allOffers, {
    location: location as string | undefined,
  });

  const comparison = computePriceComparison(filtered);
  res.json(comparison);
});

router.get("/swot", (req, res) => {
  const { location, competitor } = req.query;
  const swot = getSwotAnalysis(location as string | undefined, competitor as string | undefined);
  res.json(swot);
});

router.get("/map-points", (req, res) => {
  const { location } = req.query;
  const points = generateMapPoints(location as string | undefined);
  res.json(points);
});

router.get("/summary", (_req, res) => {
  const summary = getDashboardSummary();
  res.json(summary);
});

export default router;
