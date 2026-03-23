import { Router, type IRouter } from "express";
import {
  getAllOffers,
  filterOffers,
  computePriceComparison,
  computeMarketShare,
  getSwotAnalysis,
  getDashboardSummary,
  generateMapPoints,
  REGIONS,
} from "../data/competitorEngine.js";

const router: IRouter = Router();

router.get("/regions", (_req, res) => {
  res.json(REGIONS);
});

router.get("/offers", (req, res) => {
  const { competitor, location, neighborhoods, dateFrom, dateTo } = req.query;

  const allOffers = getAllOffers();
  const filtered = filterOffers(allOffers, {
    competitor: competitor as string | undefined,
    location: location as string | undefined,
    neighborhoods: neighborhoods as string | undefined,
    dateFrom: dateFrom as string | undefined,
    dateTo: dateTo as string | undefined,
  });

  res.json(filtered);
});

router.get("/price-comparison", (req, res) => {
  const { location, neighborhoods } = req.query;

  const allOffers = getAllOffers();
  const filtered = filterOffers(allOffers, {
    location: location as string | undefined,
    neighborhoods: neighborhoods as string | undefined,
  });

  res.json(computePriceComparison(filtered));
});

router.get("/market-share", (req, res) => {
  const { location, neighborhoods } = req.query;

  const allOffers = getAllOffers();
  const filtered = filterOffers(allOffers, {
    location: location as string | undefined,
    neighborhoods: neighborhoods as string | undefined,
  });

  res.json(computeMarketShare(filtered));
});

router.get("/swot", (req, res) => {
  const { location, competitor } = req.query;
  res.json(getSwotAnalysis(location as string | undefined, competitor as string | undefined));
});

router.get("/map-points", (req, res) => {
  const { location } = req.query;
  res.json(generateMapPoints(location as string | undefined));
});

router.get("/summary", (req, res) => {
  const { location, neighborhoods } = req.query;
  res.json(getDashboardSummary(location as string | undefined, neighborhoods as string | undefined));
});

export default router;
