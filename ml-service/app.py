from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model once at startup
print("Loading sentence-transformers model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded successfully!")


def cosine_similarity(a, b):
    """Compute cosine similarity between two vectors."""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


@app.route('/rerank', methods=['POST'])
def rerank():
    """
    Re-rank search results based on user profile similarity.
    
    Input JSON: {
        query: str,
        results: [{title, snippet, link}],
        interests: str (JSON array as string, e.g. '["AI","Technology"]')
    }
    """
    try:
        data = request.get_json()
        query = data.get('query', '')
        results = data.get('results', [])
        interests = data.get('interests', '[]')

        if not results:
            return jsonify([])

        # Parse interests if it's a string
        if isinstance(interests, str):
            try:
                import json
                interests = json.loads(interests)
            except (json.JSONDecodeError, TypeError):
                interests = []

        # Combine query + interests into a profile text
        profile_text = query
        if interests and isinstance(interests, list):
            profile_text += ' ' + ' '.join(interests)

        # Encode the profile
        profile_embedding = model.encode(profile_text)

        # Encode and score each result
        scored_results = []
        for result in results:
            title = result.get('title', '')
            snippet = result.get('snippet', '')
            result_text = f"{title} {snippet}"

            result_embedding = model.encode(result_text)
            similarity = cosine_similarity(profile_embedding, result_embedding)

            scored_result = {
                'title': title,
                'link': result.get('link', ''),
                'snippet': snippet,
                'personalizedScore': round(similarity * 100, 2)
            }
            scored_results.append(scored_result)

        # Sort by personalized score descending
        scored_results.sort(key=lambda x: x['personalizedScore'], reverse=True)

        return jsonify(scored_results)

    except Exception as e:
        print(f"Rerank error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/embed', methods=['POST'])
def embed():
    """
    Generate embedding (taste vector) for user interests.
    
    Input: { interests: [] }
    Returns: { embedding: [] }
    """
    try:
        data = request.get_json()
        interests = data.get('interests', [])

        if isinstance(interests, str):
            try:
                import json
                interests = json.loads(interests)
            except (json.JSONDecodeError, TypeError):
                interests = []

        text = ' '.join(interests) if interests else 'general'
        embedding = model.encode(text)

        return jsonify({
            'embedding': embedding.tolist()
        })

    except Exception as e:
        print(f"Embed error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
