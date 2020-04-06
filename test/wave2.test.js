const axios = require('axios');                    // Import axios.
const MockAdapter = require('axios-mock-adapter'); // This is kind of like VCR.

// Import helper functions.
const {expectResult, expectError} = require('./helper.js');

// Import our function(s) for testing.
const adaPets = require('../src/adaPets.js');
const showDetails = adaPets.showDetails;

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

describe("Wave 2", () => {
  // Set up axios test responses.
  describe("showDetails", () => {
    it("Can show details for a pet", done => {
      // Arrange.
      // Set up what we want the API to return for this test.
      mock.onGet("https://petdibs.herokuapp.com/pets/3").reply(200, {
        id: 3,
        name: "Cerberus",
        breed: "dog",
        image: null,
        about: "Three headed dog that guards the entrance to the underworld",
        age: 13700000000,
        owner: "Hades"
      });

      // Assertions come first because they need to be ready before the function call.
      expectResult(result => {
        // Assert.
        expect(result).toBeInstanceOf(Object);

        expect(result.id).toBe(3);
        expect(result.name).toBe("Cerberus");
        expect(result.breed).toBe("dog");
        expect(result.image).toBeNull();
        expect(result.about).toMatch("dog");
        expect(result.age).toBeGreaterThan(9000);
        expect(result.owner).toBe("Hades")

        done();
      });

      // Act.
      showDetails(3);
    });

    it("sets an error string when there is no selected pet", done => {
      expectError(error => {
        // Assert.
        expect(error.constructor).toBe(String);
        expect(error).toMatch("show details");
        expect(error).toMatch("select");

        done();
      });

      // Act.
      showDetails();
    })

    it("sets an error string when the response isn't successful", done => {
      // Arrange.
      // We want this to fail.
      mock.onGet("https://petdibs.herokuapp.com/pets/1000000").reply(404);

      expectError(error => {
        // Assert.
        expect(error).toMatch(/failed/i);
        expect(error).toMatch(/details/i);

        done();
      });

      // Act.
      showDetails(1000000);
    });
  });
});
