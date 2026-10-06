import chefClaudeIcon from "../images/chef-claude-icon.png"

export default function Header() {
    return(
      <header>
 <img className="logo-img" src={chefClaudeIcon} alt="Chef Claude logo" />
      <h1 className="logo-text" >Chef Claude</h1>
      </header>
      
    )
}