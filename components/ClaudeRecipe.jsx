import ReactMarkdown from "react-markdown"

export default function ClaudeRecipe(props) {
    return (
        <section className="recipe-section" ref={props.ref}>
            <h2>Chef Claude Recommends:</h2>
            <article className="suggested-recipe-container" aria-live="polite">
                {props.isLoading && <p>Chef Claude is writing your recipe…</p>}
                {props.error && <p className="recipe-error">{props.error}</p>}
                {props.recipe && <ReactMarkdown>{props.recipe}</ReactMarkdown>}
            </article>
            {props.recipe && (
                <button type="button" className="start-over-button" onClick={props.onStartOver}>
                    Make another recipe
                </button>
            )}
        </section>
    )
}
