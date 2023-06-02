import React, { Component } from "react";

export function formatCurrency(num) {
    if (num !== undefined) {
        return parseFloat(num)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    } else {
    }
}

export function getColletionBySlug(collections, slug) {
    if (collections.length > 0) {
        const result = collections.find(item => item.slug === slug.toString());
        if (result !== undefined) {
            return result.products;
        } else {
            return [];
        }
    } else {
        return [];
    }
}
export function getItemBySlug(banners, slug) {
    if (banners.length > 0) {
        const banner = banners.find(item => item.slug === slug.toString());
        if (banner !== undefined) {
            return banner;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function convertSlugsQueryString(payload) {
    let query = '';
    if (payload.length > 0) {
        payload.forEach(item => {
            if (query === '') {
                query = `slug_in=${item}`;
            } else {
                query = query + `&slug_in=${item}`;
            }
        });
    }
    return query;
}

export function StrapiProductPrice(ProductListings) {
    let view;
    if (ProductListings[0].MaxRetailPrice != ProductListings[0].OfferPrice) {
        view = (
            <p className="ps-product__price sale">
                ${formatCurrency(ProductListings[0].MaxRetailPrice)}
                <del className="ml-2">
                    ${formatCurrency(ProductListings[0].OfferPrice)}
                </del>
            </p>
        );
    } else {
        view = (
            <p className="ps-product__price">
                ${formatCurrency(ProductListings[0].OfferPrice)}
            </p>
        );
    }
    return view;
}