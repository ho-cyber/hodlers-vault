import { Menu, } from "semantic-ui-react";

export default function TopLevelThing(props: any) 
{
    const menuItem = {
        width: 150,
        justifyContent: 'center'
    }

    return <>
        <Menu inverted attached style={{ height: 50, justifyContent: 'center' }} >
            <Menu.Item
                style={menuItem}
                name='home'
                active
                onClick={console.log}
            />
            <Menu.Item
                style={menuItem}
                name='vault'
                onClick={console.log}
            />
            <Menu.Item
                style={menuItem}
                name='how it works'
                onClick={console.log}
            />
            <Menu.Item 
                icon="github"
                onClick={console.log}
            />
            </Menu>
        {
            props.children
        }
    </>
}