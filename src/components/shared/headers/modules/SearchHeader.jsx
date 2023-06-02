import React, { useEffect, useRef, useState, Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect,useSelector } from "react-redux";
import { languageLable } from "utilities/helpers";
import ProductRepository from "../../../../repositories/ProductRepository";
import { Spin } from 'antd';
import ProductSearchResult from "../../../../components/elements/products/ProductSearchResult";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const SearchHeader = () => {
    const state1=useSelector(state=>state)
 // console.log("===============>",state1.app.selectedLanguage)
  const { selectedLanguageData } = state1.app;
  
    const inputEl = useRef(null);
    const [isSearch, setIsSearch] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [resultItems, setResultItems] = useState(null);
    const [loading, setLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(keyword, 300);
    
   // const { selectedLanguageData } = this.props.app;

    function handleClearKeyword() {
        setKeyword('');
        setIsSearch(false);
        setLoading(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        this.props.history.push(`/?pageSize=2147483647&${keyword}`);
    }

    useEffect(() => {
        if (debouncedSearchTerm) {
            setLoading(true);
            if (keyword) {
                const userDetails = (localStorage.getItem('defaultAddress'));
                const locationIdJsonParse = JSON.parse(userDetails);
                const locationId = locationIdJsonParse.BusinessCustomerAddressMapping.LocationId;
                
                const queries = {
                    locationId : locationId,
                    searchString: keyword
                };
                const products = ProductRepository.getRecords(queries);
                products.then((result) => {
                    setLoading(false);
                    setResultItems(result.products.Results);
                    setIsSearch(true);
                });
            } else {
                setIsSearch(false);
                setKeyword('');
            }
            if (loading) {
                setIsSearch(false);
            }
        } else {
            setLoading(false);
            setIsSearch(false);
        }
    }, [debouncedSearchTerm]);

    // Views
    let productItemsView,
        clearTextView,
        loadingView,
        loadMoreView;
    if (!loading) {
        if (resultItems && resultItems.length > 0) {
            if (resultItems.length > 5) {
                loadMoreView = (
                    <div className="ps-panel__footer text-center">
                        <Link to="/">
                            <a>See all results</a>
                        </Link>
                    </div>
                );
            }
            productItemsView = resultItems.map((product) => (
                <ProductSearchResult product={product} key={product.Id} />
            ));
        } else {
            productItemsView = <p>No product found.</p>;
        }
        if (keyword !== '') {
            clearTextView = (
                <span className="ps-form__action" onClick={handleClearKeyword}>
                    <i className="icon icon-cross2"></i>
                </span>
            );
        }
    } else {
        loadingView = (
            <span className="ps-form__action">
                <Spin size="small" />
            </span>
        );
    }

    

    return (
        <form
            className="ps-form--quick-search"
            method="get"
            action="/"
            onSubmit={handleSubmit}>
                <input
                    ref={inputEl}
                    className="form-control"
                    type="text"
                    value={keyword}
                    placeholder={languageLable(selectedLanguageData, "Search Product")}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {clearTextView}
                {loadingView}
            
            <button onClick={handleSubmit}>{languageLable(selectedLanguageData, "Search")}</button>
            <div
                className={`ps-panel--search-result${
                    isSearch ? ' active ' : ''
                }`}>
                <div className="ps-panel__content">{productItemsView}</div>
                {loadMoreView}
            </div>
        </form>
    );
};


export default connect((state) => state)(withRouter(SearchHeader));
