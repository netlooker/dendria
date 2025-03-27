{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    # Add flake-parts input
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  # Make sure flake-parts is destructured from inputs
  outputs = inputs@{ self, nixpkgs, flake-parts, ... }:
    # Pass flake-parts input to mkFlake
    flake-parts.lib.mkFlake { inherit inputs; } {
      # List of systems to build for
      systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin" ];

      # Configuration applied per-system
      perSystem = { pkgs, ... }: {
        # Define the default development shell
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs # Change version here if needed
            # Add other packages like yarn, git, etc. if required
          ];
        };
      };

      # Optional: You could add flake-global config here if needed
      # flake = { };
    };
}
