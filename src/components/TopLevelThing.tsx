import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, } from "semantic-ui-react";
import {
    selectPage,
    setCurrentPage,
  } from '../slices/pageSlice';

export default function TopLevelThing(props: any) 
{
    const page = useSelector(selectPage);
    const dispatch = useDispatch();

    const menuItem = {
        width: 150,
        justifyContent: 'center',
        height: '100%'
    }

    return <>
        <Menu inverted attached style={{ height: 50, justifyContent: 'center' }} >
            <Link to="/">
                <Menu.Item
                    style={menuItem}
                    name="home"
                    active={page.currentPage == "home"}
                    onClick={() => dispatch(setCurrentPage("home"))}
                />
            </Link>
            
            <Link to="/tokens">
                <Menu.Item
                    style={menuItem}
                    name="tokens"
                    active={page.currentPage == "tokens"}
                    onClick={() => dispatch(setCurrentPage("tokens"))}
                />
            </Link>
            
            <Link to="howitworks">
                <Menu.Item
                    style={menuItem}
                    name={"how it works"}
                    active={page.currentPage == "how it works"}
                    onClick={() => dispatch(setCurrentPage("how it works"))}
                />
            </Link>
            
            <a href="https://github.com/d0n-th/hodlers-vault" target="_blank" style={{ padding:0 }}>
                <Menu.Item 
                    style={{ height: '100%' }}
                    icon="github"
                    onClick={() => {}}
                />
            </a>
            
            </Menu>
        {
            props.children
        }
    </>
}