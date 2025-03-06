from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

EMISSION_FACTORS = {
    "electricity": 0.5,  # kg CO2 per kWh
    "diesel": 2.7,       # kg CO2 per liter
    "gasoline": 2.3,     # kg CO2 per liter
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    activities = data['activities']

    total_emissions = 0
    results = []

    for activity in activities:
        activity_type = activity['type']
        source = activity['source']
        amount = float(activity['amount'])

        # Calculate emissions
        emission_factor = EMISSION_FACTORS.get(activity_type, 0)
        emissions = amount * emission_factor
        total_emissions += emissions

        # Append results per activity
        results.append({
            "source": source,
            "type": activity_type,
            "emissions": emissions
        })

    # Recommendations based on thresholds
    recommendations = []
    if total_emissions > 1000:
        recommendations.append("Consider switching to renewable energy sources.")
    if sum(a['emissions'] for a in results if a['type'] == "diesel") > 500:
        recommendations.append("Reduce fuel usage or adopt hybrid vehicles.")

    return jsonify({
        "activities": results,
        "total_emissions": total_emissions,
        "recommendations": recommendations
    })

if __name__ == '__main__':
    app.run(debug=True)

