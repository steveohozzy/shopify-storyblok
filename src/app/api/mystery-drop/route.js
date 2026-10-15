import { NextResponse } from "next/server";
import { getProducts } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const vendorFilter = (
      searchParams.get("vendor") || ""
    ).trim().toLowerCase();

    const productTypeFilter = (
      searchParams.get("productType") || ""
    ).trim().toLowerCase();

    const products = await getProducts();

    const eligibleProducts = products.filter((product) => {
      if (!product.availableForSale) return false;

      if (
        vendorFilter &&
        product.vendor.toLowerCase() !== vendorFilter
      ) {
        return false;
      }

      if (
        productTypeFilter &&
        product.productType.toLowerCase() !== productTypeFilter
      ) {
        return false;
      }

      return true;
    });

    if (eligibleProducts.length === 0) {
      return NextResponse.json(
        {
          error:
            "No available products match this Mystery Drop. Check your filters and try again.",
        },
        { status: 404 }
      );
    }

    const product =
      eligibleProducts[
        Math.floor(Math.random() * eligibleProducts.length)
      ];

    return NextResponse.json(product, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Mystery Drop error:", error);

    return NextResponse.json(
      {
        error: "Unable to load a Mystery Drop. Please try again.",
      },
      { status: 500 }
    );
  }
}