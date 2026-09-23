import ReactMarkdown from "react-markdown"

export default function ClaudeRecipe(props) {
    return (
        <section>
            <h2>Chef Claude Recommends:</h2>
            <article className="suggested-recipe-container" aria-live="polite">
                {props.isLoading && <p>Chef Claude is writing your recipe…</p>}
                {props.error && <p className="recipe-error">{props.error}</p>}
                {props.recipe && <ReactMarkdown>{props.recipe}</ReactMarkdown>}
            </article>
        </section>
    )
}
