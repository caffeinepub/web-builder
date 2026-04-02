actor {
  var pageData : ?Text = null;

  public shared ({ caller }) func savePage(data : Text) : async () {
    pageData := ?data;
  };

  public query ({ caller }) func loadPage() : async ?Text {
    pageData;
  };
};
