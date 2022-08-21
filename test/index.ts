import { expect } from "chai";
import { ethers } from "hardhat";

const defaultEvent = { name: "Test event", description: "test description", link: "https://example.com", maxParticipants: 10, registrationEnd: Date.now() + 100000, start: Date.now() + 200000, end: Date.now() + 40000, ticketPrice: 10000, preSaleTicketPrice: 9000 };

const createEventCreator = async () => {
    const EventCreator = await ethers.getContractFactory("EventCreator");
    const eventCreator = await EventCreator.deploy();
    await eventCreator.deployed();
    return eventCreator;
}

const createEvent = async (eventCreator: any, evt?: any) => {
    const Event = await ethers.getContractFactory("Event");
    const eventObj = evt || defaultEvent;
    await (await eventCreator.createEvent(eventObj)).wait()
    const eventAddress = await eventCreator.events(0);
    return Event.attach(eventAddress);

}

describe("EventCreator", function () {
  it("Should create new event contract", async function () {
    const eventCreator = await createEventCreator();
    const eventContract = await createEvent(eventCreator);
    for (const key in defaultEvent) {
      // @ts-ignore
      const val = await eventContract[key]();
      const isBn = typeof val.toNumber === 'function';
      // @ts-ignore
      expect(isBn ? val.toNumber() : val).to.equal(defaultEvent[key]);
    }
  });
});

describe("Event", function () {
  it("Should create new event contract", async function () {
    const eventCreator = await createEventCreator();
    const eventContract = await createEvent(eventCreator);
    for (const key in defaultEvent) {
      // @ts-ignore
      const val = await eventContract[key]();
      const isBn = typeof val.toNumber === 'function';
      // @ts-ignore
      expect(isBn ? val.toNumber() : val).to.equal(defaultEvent[key]);
    }
  });
});
